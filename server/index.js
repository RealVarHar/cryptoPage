import process from 'node:process';
import fastify from 'fastify';
import fs from 'fs';
import reactHandler from "./reactHandler.js";
let appRoutes=fs.promises.readFile('../front-end/src/App.jsx',{encoding:'utf8'});
import path from 'path';
import toolbox from "./toolbox.js"
global.toolbox=toolbox;
import database from "./database.js";
import crypto from 'crypto';
global.database=database;
import coingetter from "./coingetter.js";
coingetter.refreshList();
let majorversion=parseInt(process.version.substr(1).split('.',1)[0]);
if(majorversion<17){
  global.structuredClone=function(json){
    if(json==null)return 'null';
    if(json instanceof Date) return new Date(json);
    if(typeof(json)!="object"){
        return json;
    }
    if(Array.isArray(json)){
        let ret=new Array(json.length);
        for(let i in json){
          ret[i]=global.structuredClone(json[i]);
        }
        return ret;
    }else{
        let ret={};
        for(let i in json){
          ret[i]=global.structuredClone(json[i]);
        }
        return ret;
    }
  }
}else{
  global.structuredClone=structuredClone;
}
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

await reactHandler.registerRoutes(app,appRoutes);

app.get('*',async (req,res) => {
    let url=path.normalize(req.url);
    let file;
    try{
        let filepath='../front-end'+url;
        file=await reactHandler.returnfile(filepath,res);
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
let getBody=function(parameters,body,strict=true){
    for(let parameter in parameters){
        let getter;
        if(typeof(parameter)=='string'){
            getter=parameters[parameter];
        }else{
            getter='array';
        }
        let value=toolbox.getters[getter](body[parameter]);
        if(strict&& (value===null||body[parameter].toString().length==0) ){
            const err = new Error();
            err.statusCode = 400;
            err.message = 'Post variables are not valid';
            throw err
        }else{
            parameters[parameter]=value;
        }
    }
}
app.post('/login',async (req,res) => {
    let parameters={user:"string",password:"string"};
    getBody(parameters,req.body);
    let password=crypto.pbkdf2Sync(parameters.password, database.config.salt,  100, 64, `sha512`).toString(`hex`); 
    let user=database.queryRow("select name from users where name=? and password=?",[parameters.user,password]);
    if(user==undefined){
        const err = new Error();
        err.statusCode = 400;
        err.message = 'User not found';
        throw err
    }
});
app.post('/register',async (req,res) => {
    let parameters={user:"string",password:"string"};
    getBody(parameters,req.body);
    let userTaken=database.queryRow("select name from users where name=?",[parameters.user]);
    if(userTaken!=undefined){
        const err = new Error();
        err.statusCode = 400;
        err.message = 'Username Taken';
        throw err
    }else{
        let password=crypto.pbkdf2Sync(parameters.password, database.config.salt,  100, 64, `sha512`).toString(`hex`); 
        database.query("insert into users (name,password,balance) values (?,?,?)",[parameters.user,password,1000]);
    }
});
app.post('/checkLogin',async (req,res) => {
    let parameters={user:"string"};
    getBody(parameters,req.body);
    let userTaken=database.queryRow("select name from users where name=?",[parameters.user]);
    return userTaken!=undefined;
});
app.post('/searchCoin',async (req,res)=>{
    let parameters={limit:"int",name:"string",dates:["date"],sorting:"string"};
    getBody(parameters,req.body,false);
    let order="desc";
    if(parameters.sorting==null) parameters.sorting="";
    if(parameters.sorting.endsWith("_desc")) parameters.sorting=parameters.sorting.slice(0,-"_desc".length);
    if(parameters.sorting.endsWith("_asc")){
        parameters.sorting=parameters.sorting.slice(0,-"_desc".length);
        order="asc";
    }
    if(!["id","market_cap","name","symbol"].includes(parameters.sorting)) parameters.sorting="market_cap";
    return coingetter.search(parameters.name,parameters.limit,parameters.dates,parameters.sorting,order);
});
app.listen({port: arg.httpsPort,host: arg.ip},() => {
    console.log(`Server ${process.pid} started`)
});
