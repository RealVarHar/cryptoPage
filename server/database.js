import Database from 'better-sqlite3';
const db = new Database('./database.db');
db.pragma('journal_mode = WAL');
import CoinGecko from 'coingecko-api';
CoinGecko.TIMEOUT=60000;
const CoinGeckoClient = new CoinGecko();

import crypto from 'crypto';
import { Buffer } from 'node:buffer';
import toolbox from "./toolbox.js"
function _query(query,queryString,values=[],method){
    try{
        if(Array.isArray(values)){
            values=values.map(e=>{
                if(typeof(e)=='object'&&!Buffer.isBuffer(e)){
                    e=Buffer.from(JSON.stringify(e));
                }return e;
            });
            return query[method](...values);
        }else{
            for(let key in values){
                if(typeof(values[key])=='object'&&!Buffer.isBuffer(values[key])){
                    values[key]=Buffer.from(JSON.stringify(values[key]));
                }
            }
            return query[method](values);
        }
    }catch(e){
        console.log("Error executing query",queryString,e.message);
        return new Promise((r)=>{r(null)});
    }
}
function query(query,values=[]){
    return _query(db.prepare(query),query,values,"run");
}
function queryRows(query,values=[]){
    let data=_query(db.prepare(query),query,values,"all");
    for(let entry of data){
        for(let key in entry){
            let item=entry[key];
            if(Buffer.isBuffer(item))entry[key]=JSON.parse(item);
        }
    }
    return data;
}
function queryRow(query,values=[]){
    let entry=_query(db.prepare(query),query,values,"get");
    for(let key in entry){
        let item=entry[key];
        if(Buffer.isBuffer(item))entry[key]=JSON.parse(item);
    }
    return entry;
}
async function queryBulk(query,values=[]){
    //returns column names and iterator over arrays of results
    let stmt=db.prepare(query);
    let columns=stmt.columns().map(column => column.name);
    let j=0;columns=columns.reduce((o,i)=>{o[i]=j++;return o},{});
    let data=await _query(stmt.raw(),query,values,'iterate');//use for or next()
    return {columns,data};//cant parse data.next() Buffors will be returned!
}
let tableNames=queryRows("SELECT name FROM sqlite_master WHERE type='table' AND name in ('coins','coinsSparkline','users','config')").map(e=>e.name);
if(!tableNames.includes('users')){
    query("CREATE TABLE users (id Integer PRIMARY KEY, name Text,password Integer,balance Real)");
}
if(!tableNames.includes('coinsSparkline')){
    query("CREATE TABLE coinsSparkline (id TEXT NOT NULL, year Integer NOT NULL,day Integer NOT NULL,prices BLOB, PRIMARY KEY ( id, year,day))");
}
if(!tableNames.includes('coins')){
    query("CREATE TABLE coins (id TEXT PRIMARY KEY,symbol TEXT,name TEXT,last_update Integer,last_sparkline_update Integer,price Real,market_cap Integer, data BLOB )");
    query("create index _sparklineOrder on coins(market_cap)");
    query("create index _sparklineOrder2 on coins(symbol)");
    query("create index _sparklineOrder3 on coins(name)");
}
let config={};
if(!tableNames.includes('config')){
    query("CREATE TABLE config (setting Text PRIMARY KEY,value Text)");
    config.salt=crypto.randomBytes(16).toString('hex');
    query("insert into config (setting,value) values (?,?)",["salt",config.salt]);
}else{
    config=await queryRows("select setting,value from config");
    config=config.reduce((a,b)=>{a[b.setting]=b.value;return a},{});
}
export default {query,queryRow,queryRows,queryBulk,config}