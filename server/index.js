import process from 'node:process';
import fastify from 'fastify';
import fs from 'fs';
let appRoutes=fs.promises.readFile('../front-end/src/App.jsx',{encoding:'utf8'});
import path from 'path';
import babel from "@babel/core";
import { Buffer } from 'node:buffer';
import postcss from 'postcss';
import atImport from "postcss-import";
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import postcssMinify from 'postcss-minify';
var arg={};
for(let i=2;i<process.argv.length;i++) {
    if(process.argv[i][0]=="-") {
        if(i+1<process.argv.length&&process.argv[i+1][0]!="-") {
            arg[process.argv[i].ltrim("-")]=process.argv[i+1];
            i++;
        } else {
            arg[process.argv[i].substr(1)]=true;
        }
    }
}
if(arg.httpsPort==undefined) arg.httpsPort=arg.port;
if(arg.httpsPort==undefined) arg.httpsPort=80;
if(arg.ip==undefined) arg.ip="0.0.0.0";

const app=fastify({});
await Promise.all([
    app.register(import('@fastify/compress')),
    app.register(import('@fastify/formbody')),
    app.register(import('fastify-xml-body-parser')),
    app.register(import('fastify-qs')),
]);
app.addHook('preHandler',async (req,res) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET, POST');
    res.header('Access-Control-Allow-Headers','X-Requested-With,content-type, Authorization');
});
let mimeTypes={};
fs.promises.readFile('file-extension-to-mime-types.json',{encoding:'utf8'}).then((file)=>{
    mimeTypes=JSON.parse(file);
})
async function mkdir(url){
    try {
        await fs.promises.mkdir(url, { recursive: true });
    } catch {}
    return;
}
async function convertCSS(input,path){
    let result= await postcss([tailwindcss,autoprefixer,postcssMinify]).use(atImport()).process(input,{from:path});
    return result.css;
}
async function convertJSX(input,path){
    return (await babel.transformAsync(input, {presets: ["@babel/preset-react"]})).code;
}
async function returnfile(url,res,redirected=false){
    url=url.replaceAll('\\','/');
    let extension=url.lastIndexOf(".");
    let mime;
    if(extension>"../front-end".length){
        extension=url.substr(extension);
        mime=mimeTypes[extension];
    }else{
        //addressing a folder or extension not provided
        let tmp=url.lastIndexOf("/");
        let searched=url.substr(tmp+1);
        let containingFolder=url.substr(0,tmp);
        let files=await fs.promises.readdir(containingFolder);
        let foundfile;
        for(let fileName of files){
            if(fileName.startsWith(searched)){
                if(fileName==searched){
                    let isdir=(await fs.promises.stat(containingFolder+"/"+fileName)).isDirectory();
                    if(isdir){
                        return await returnfile(containingFolder+"/"+fileName+"/index",res,true);
                    }else{
                        //ok file, set mimetype
                        mime=mimeTypes[".txt"];
                        extension=".txt";
                    }
                }else{
                    if(fileName[searched.length]=='.'){
                        let isdir=(await fs.promises.stat(containingFolder+"/"+fileName)).isDirectory();
                        if(!isdir){
                            foundfile=fileName;
                        }
                    }
                }
            }
        }
        if(foundfile!=undefined){
            return await returnfile(containingFolder+"/"+foundfile,res,true);
        }
        console.log(url);
        throw new Error();
    }
    if(redirected){
        return url.substr("../front-end".length);
    }
    res.header('content-type', mime+'; charset=utf-8');
    res.type(mime);
    let filepath=url;
    let parsefile='';
    let decode=true;
    if(["image","video"].includes(mime.split('/')[0])){
        decode=false;
    }
    if(extension=='.jsx'){
        parsefile=convertJSX;
    }else if(extension=='.css'){
        parsefile=convertCSS;
    }
    if(parsefile!==''){
        let cachepath='../babel-cache'+url.substr('../front-end'.length);
        let filename=url.split('/').pop();
        //check if parsed exists
        let filestat=await fs.promises.stat(filepath);
        try{
            let cachestat=await fs.promises.stat(cachepath);
            if(cachestat.mtime.getTime()==filestat.mtime.getTime()){
                return fs.createReadStream(cachepath, 'utf8');
            }else{
                throw new Error();
            }
        }catch{
            try{
                await mkdir(cachepath.substr(0,cachepath.length-filename.length-1));
                let file=await fs.promises.readFile(filepath, { encoding: 'utf8' });
                file=await parsefile(file,filepath);
                fs.promises.writeFile(cachepath,file, { encoding: 'utf8' }).then(()=>{
                    fs.promises.utimes(cachepath,filestat.atime,filestat.mtime);
                });
                if(decode){
                    return Buffer.from(file,'utf8');
                }else{
                    return Buffer.from(file);
                }
            }catch(e){
                console.log(e.message);
            }
        }
    }
    if(decode){
        return fs.createReadStream(url, 'utf8');
    }else{
        return fs.createReadStream(url);
    }
};
appRoutes=await appRoutes;
let lastAppRoute=0;
lastAppRoute=appRoutes.indexOf("<Route ");
while(lastAppRoute!=-1){
    let pathStart=appRoutes.indexOf("path=",lastAppRoute+"path=".length);
    let entry=[appRoutes.indexOf("'",pathStart),"'"];
    if(entry[0]==-1)entry[0]=null;
    let altentry=appRoutes.indexOf('"',pathStart);
    if(altentry!=-1&&altentry<entry[0])entry=[altentry,'"'];
    altentry=appRoutes.indexOf('`',pathStart);
    if(altentry!=-1&&altentry<entry[0])entry=[altentry,'`'];
    let end=appRoutes.indexOf(entry[1],entry[0]+1);
    let route=appRoutes.substring(entry[0]+1,end);
    if(route[0]=="/"){
        console.log("adding route "+route);
        app.get(route,async (req,res) => {try{return returnfile('../front-end/index.html',res);}catch(e){console.log(e);}});
    }
    lastAppRoute=appRoutes.indexOf("<Route ",end);
}
app.get('*',async (req,res) => {
    let url=path.normalize(req.url);
    let file;
    try{
        let filepath='../front-end'+url;
        file=await returnfile(filepath,res);
    }catch(e){
        console.log(e);
        const err = new Error();
        err.statusCode = 404
        err.message = 'File or function not found'
        throw err
    }
    if(typeof(file)=='string'){
        res.redirect(file);
    }else{
        return file;
    }
});
app.listen({port: arg.httpsPort,host: arg.ip},() => {
    console.log(`Server ${process.pid} started`)
});
