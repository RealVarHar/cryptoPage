import process from 'node:process';
import fastify from 'fastify';
import fs from 'fs';
import reactHandler from "./reactHandler.js";
let appRoutes=fs.promises.readFile('../front-end/src/App.jsx',{encoding:'utf8'});
import path from 'path';
import database from "./database.js";
import crypto from 'crypto';
global.database=database;
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
let getters={
    string:function (str){
        //check if this is a string
        if(typeof(str)=="string")return str;
        return null;
    },
    float:function(str){
        //check if this is a number
        if(typeof(str)!="number"&&typeof(str)!='string')return null;
        str=parseFloat(str);
        if(str!=str)return null;
        return str;
    },
    int:function(str){
        //check if this is a number and not a float
        str=getFloat(str);
        let str2=parseInt(str);
        if(str!=str2)return null;
        return str2;
    },
    bool:function(input){
        //check if this is a number and not a float
        let type=typeof(input);
        if(type=='string'){
            return input=="true"||input=="1";
        }else if(type=='number'){
            return input!=0;
        }else if(type=='boolean'){
            return input;
        }
        return null;
    }
}
let getBody=function(parameters,body){
    for(let parameter in parameters){
        let value=getters[parameters[parameter]](body[parameter]);
        if(value===null||body[parameter].toString().length==0){
            const err = new Error();
            err.statusCode = 400;
            err.message = 'Post variables are not valid';
            throw err
        }else{
            body[parameter]=value;
        }
    }
}
app.post('/login',async (req,res) => {
    let parameters={user:"string",password:"string"};
    getBody(parameters,req.body);
    let password=crypto.pbkdf2Sync(parameters.password, database.config.salt,  100, 64, `sha512`).toString(`hex`); 
    let user=database.queryRow("select name from users where name=? and password=?",[parameters.user,parameters.password]);
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
    getBody(parameters);
    let userTaken=database.queryRow("select name from users where name=?",[parameters.user]);
    return userTaken!=undefined;
});
app.listen({port: arg.httpsPort,host: arg.ip},() => {
    console.log(`Server ${process.pid} started`)
});
