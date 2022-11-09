import Database from 'better-sqlite3';
const db = new Database('./database.db', { verbose: console.log });
import CoinGecko from 'coingecko-api';
const CoinGeckoClient = new CoinGecko();
import crypto from 'crypto';
function _query(query,queryString,values=[],method){
    try{
        if(Array.isArray(values)){
            return query[method](...values);
        }else{
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
    return _query(db.prepare(query),query,values,"all");
}
function queryRow(query,values=[]){
    return _query(db.prepare(query).pluck(),query,values,"get");
}
async function queryBulk(query,values=[]){
    //returns column names and iterator over arrays of results
    let stmt=db.prepare(query);
    let columns=stmt.columns().map(column => column.name);
    let j=0;columns=columns.reduce((o,i)=>{o[i]=j++;return o},{});
    let data=await stmt.raw().iterate(...values);//use for or next()
    return {columns,data};
}
let res=queryRows("SELECT name FROM sqlite_master WHERE type='table' AND name in ('coins','coinsSparkline','users','config')");
res=res.map(e=>e.name);
if(!res.includes('users')){
    query("CREATE TABLE users (id Integer PRIMARY KEY, name Text,password Integer,balance Real)");
}
if(!res.includes('coinsSparkline')){
    query("CREATE TABLE coinsSparkline (id TEXT PRIMARY KEY, year Integer,day Integer,hour Integer,price Real,market_cap Integer)");
}
if(!res.includes('coins')){
    query("CREATE TABLE coins (id TEXT PRIMARY KEY,name TEXT,price Real,market_cap Integer, data BLOB,initialized Integer )");
    query("create index _sparklineOrder on coins(market_cap)");
}
let config={};
if(!res.includes('config')){
    query("CREATE TABLE config (setting Text PRIMARY KEY,value Text)");
    config.salt=crypto.randomBytes(16).toString('hex');
    query("insert into config (setting,value) values (?,?)",["salt",config.salt]);
}else{
    config=await queryRows("select setting,value from config");
    config=config.reduce((a,b)=>{a[b.setting]=b.value;return a},{});
}
function getDayDiff(start,now){
    let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    let oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
function toYearDay(year,month,day){
    let now;
    if(typeof(year)=='object'){
        now=year;
    }else{
        now=new Date(year,month,day);
    }
    var start = new Date(year, 0, 0);
    return getDayDiff(start,now);
}
function fromYearDay(year,day){
    let now=new Date(year,0,0);
    now.setDate(day);
    return now;
}
let fetchCoin={
    checkCache:async(coin="",currency="usd",year=2000,day=0)=>{
        //check if cache already has that day ( keep it DRY )
        let cache=await queryRows("select id,year,day,hour,price,market_cap from coinsSparkline where id=? and year=? and day=?",[coin,year,day]);
        if(cache.length==24){//already have that day
            return cache;
        }else if( cache.length>0&&getDayDiff(new Date(),fromYearDay(year,day))<90 ){
            if(cache.length==1)return cache;//cant get better resolution from server
            await queryRow("delete from coinsSparkline where id=? and year=? and day=?",[coin,year,day]);
            cache[0].hour=0;
            queryRow("insert into coinsSparkline (id,year,day,hour,price,market_cap) values (?,?,?,?,?,?)",[coin,year,day,0,cache[0].price,cache[0].market_cap]);
            return [cache[0]];
        }
        return false;
    },
    autoRange:async function(coins=[""],year=2000,day=0,currency="usd"){
        let now=new Date();
        let today={year:now.getFullYear(),day:toYearDay(now),hour:now.getHours()};
        if(year>today.year||(year==today.year&&day>today.day)||year<1900||day<0)return false;

        if(getDayDiff(fromYearDay(year,day),new Date())>89){
            fetchCoin.oldRange(coins,year,day,currency);
        }else{
            fetchCoin.newRange(coins,currency);
        }
    },
    oldRange:async function(coins=[""],year=2000,day=0,currency="usd"){
        let from=fromYearDay(year,day);from=from.getTime()/1000;
        let to=fromYearDay(year,day+1);to=to.getTime()/1000;
        for(let coinId of coins){
            let range=await CoinGeckoClient.coins.fetchMarketChartRange(coinId,{vs_currency:currency,from,to});
            let days={};
            for(let price of range){
                let date=new Date(price[0]);
                let tag=date.getFullYear()+":"+date.getHours();
                if(days[tag]==undefined)days[tag]=[];
                days[tag].push([date.getTime(),price]);
                date.setHours(date.getHours()-1);
            }
            fetchCoin.updateCache(coinId,"usd",day[0],day[1],{id:coinId,prices,market_cap:coin.market_cap}).then(resolve2);
        }
    },
    newRange:async function(coins=[""],currency="usd",order="market_cap_desc"){

        if(coins=="all"){
            return await CoinGeckoClient.coins.markets({vs_currency:currency,order,sparkline:true});
        }
        let fetch=[];
        async function addUninitialized(addTo,rejectIds){
            //dont waste this api call, add some uninitialized ones to the list
            let init= await queryRows("select id from coins where initialized=0 and id not in ("+Array(rejectIds.length).fill("?").join(',')+") limit "+(250-addTo.length),...rejectIds);
            addTo.push(...init.map(a=>a.id));
        }
        async function getData(coinIds){
            let res=await CoinGeckoClient.coins.markets({ids:coinIds,vs_currency:currency,order,sparkline:true});
            for(let coin of res){
                let date=new Date(coin.last_updated.replace(/Z+$/, ''));
                date=new Date(date.getUTCFullYear(),date.getMonth(),date.getDate(),date.getHours());
                let days={};
                for(let price of coin.sparkline_in_7d.price){
                    let tag=date.getFullYear()+":"+date.getHours();
                    if(days[tag]==undefined)days[tag]=[];
                    days[tag].push([date.getTime(),price]);
                    date.setHours(date.getHours()-1);
                }
                let promises2=[];
                for(let tag in days){
                    let prices=days[tag];
                    let day=tag.split(":");
                    promises2.push(new Promise((resolve2)=>{
                        fetchCoin.updateCache(coin.id,"usd",day[0],day[1],{id:coin.id,name:coin.name,prices,market_cap:coin.market_cap}).then(resolve2);
                    }));
                }
                await Promise.all(promises2);
            }
        }
        if(coins.length>250){
            let promises=[];
            for(let page=1;page<=Math.ceil(coins.length/250);page++){
                if(page==Math.ceil(coins.length/250)){
                    promises.push(new Promise((resolve)=>{
                        let coinPage=coins.slice((page-1)*250,page*250);
                        addUninitialized(coinPage,coins).then(
                            ()=>{getData(coinPage).then(resolve)}
                        );
                    }));
                }else{
                    promises.push(new Promise((resolve)=>{
                        getData(coins.slice((page-1)*250,page*250)).then(resolve);
                    }));
                }
            }
            await Promise.all(promises);
        }
        if(coins.length<250){
            await addUninitialized(coins,coins);
            await getData();
        }
    },
    updateCache:async (coin="",currency="usd",year=2000,day=0,fetched)=>{
        //let fetched=await CoinGeckoClient.coins.fetchMarketChartRange(coin,{vs_currency:currency,from,to});
        let datapoints={};
        for(let datapoint of fetched.prices){
            let date=new Date(datapoint[0]);
            datapoints[datapoint[0]]={year:date.getFullYear(),day:toYearDay(date),hour:date.getHours(),price:datapoint[1]};
        }
        let qstring="";
        let bind=[];
        for(let dp of datapoints){
            if(qstring.length>0)qstring=qstring+',';
            qstring=qstring+"(?,?,?,?,?,?)";
            bind.splice(bind.length,0,coin,dp.year,dp.day,db.hour,dp.price,dp.market_cap);
        }
        await queryRow(`update coin set price=?, market_cap=?`,[]);
        await queryRow(`insert into coinsSparkline (id,year,day,hour,price,market_cap) 
        select net.id,net.year,net.day,net.hour,net.price,net.market_cap 
        from ( values `+qstring+`) as net (id,year,day,hour,price,market_cap)
        where not exists ( select id,year,day,hour,price,market_cap from coinsSparkline old 
        where old.id=net.id and old.year=net.day and old.hour=net.hour)`);
        return Object.values(datapoints);
    }
}
async function gatherCoinSparkline(coin="",currency="usd",year=2000,day=0,fetch){
    //check if cache already has that day ( keep it DRY )
    let res=fetchCoin.checkCache(coin="",currency="usd",year=2000,day=0);
    if(res!==false)return res;
    
}
async function refreshCoinsList(){
    list=queryRows("select id from coins");
    list=list.reduce((o,i)=>{o[i]=true;return o},{});
    let freshList=await CoinGeckoClient.coins.list();
    let missing=[];
    for(let coin of freshList){
        if(!list[coin.id])missing.push([coin.id,coin.name,{},0]);
    }
    await queryRow("insert into coins (id,name,data,initialized) values "+Array(missing.length).fill("(?,?,?,?)").join(','),...missing.reduce((o,i)=>{o.push(...i);return o},[]));
}

async function gatherCoin(coinslist="all"){
    //issue: cant get all coins due to api call limit
    //resolution: get only coins ordered by market_cap_desc
    //when 
}

async function getCoins(coinslist="all"){
    //get cached list of coins
    let list;
    if(coinslist=="all"){
        list=queryBulk("select id,name,data from coins");
    }else{
        list=queryBulk("select id,name,data from coins where id in ("+Array(coinslist.length).fill("?").join(',')+")",coinslist);
    }
    let columns=list.columns;
    let data=[];
    let promises=[];
    //get cached sparkline data
    for(let coin of list.data){
        promises.push(new Promise(async ()=>{
            coin.sparkline=[];
            let today=new Date();
            for(let i=0;i<7;i++){
                //TODO: batch this, api limit over speed
                let newdata=await gatherCoinSparkline(coin.id,"usd",today.getFullYear(),toYearDay(today));
                if(newdata.length==1&&i!=0){
                    newdata=Array(24).fill(newdata[0][columns.price]);
                }else{
                    newdata=newdata.map(a=>a[columns.price]);
                }
                coin.sparkline.splice(coin.sparkline.length,0,...newdata);
                today.setDate(today.getDate()-1);
            }
            data.push(coin);
        }));
    }
    await Promise.all(promises);
    refreshCoinsList();
    return data;
}
export default {query,queryRow,queryBulk,config}