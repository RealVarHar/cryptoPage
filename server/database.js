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
let res=queryRows("SELECT name FROM sqlite_master WHERE type='table' AND name in ('coins','coinsSparkline','users','config')");
res=res.map(e=>e.name);
if(!res.includes('users')){
    query("CREATE TABLE users (id Integer PRIMARY KEY, name Text,password Integer,balance Real)");
}
if(!res.includes('coinsSparkline')){
    query("CREATE TABLE coinsSparkline (id TEXT NOT NULL, year Integer NOT NULL,day Integer NOT NULL,hour Integer NOT NULL,price Real,market_cap Integer, PRIMARY KEY ( id, year,day,hour))");
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
let getDayDiff=toolbox.getDayDiff;
let toYearDay=toolbox.toYearDay;
let fromYearDay=toolbox.fromYearDay;
let fetchCoin={
    checkCache:(coin="",year=2000,day=0)=>{
        //check if cache already has that day ( keep it DRY )
        let today=new Date();
        let maxHours=today.getHours();
        today=today.getFullYear()+":"+toolbox.toYearDay(today);today=today==(year+":"+day);
        function toDayPrices(cache){
            cache=cache.map(a=>a.price);
            let hr=24;
            if(today)hr=maxHours;
            if(cache.length<hr){
                cache.push(...Array(hr-cache.length).fill(cache[cache.length-1]));
            }
            return cache;
        }
        let cache=queryRows("select hour,price,market_cap from coinsSparkline where id=? and year=? and day=?",[coin,year,day]);
        if(cache.length==24){//already have that day
            return toDayPrices(cache);
        }else if( cache.length>0 && getDayDiff(new Date(),fromYearDay(year,day))>=90){
                if(cache.length==1)return toDayPrices(cache);//cant get better resolution from server
                queryRow("delete from coinsSparkline where id=? and year=? and day=?",[coin,year,day]);
                cache[0].hour=0;
                queryRow("insert into coinsSparkline (id,year,day,hour,price,market_cap) values (?,?,?,?,?,?)",[coin,year,day,0,cache[0].price,cache[0].market_cap]);
                return toDayPrices([cache[0]]);
        }else if(today&&cache.length>=maxHours-1){
            return toDayPrices(cache);//has all hours today that are possible
        }
        if(cache.length>0)debugger;
        return false;
    },
    search:async function(name="",limit=250,days=[]){
        console.log("search"+name+limit+JSON.stringify(days));
        let results={};
        if(limit==null)limit=250;
        if(days==null)days=[];
        if(days.length==0)days.push(new Date());
        if(name==null||name==''){
            for(let date of days){
                date={year:date.getFullYear(),day:toYearDay(date)};
                results[date.year+":"+date.day]=await fetchCoin.autoRange("all",date.year,date.day);
            }
        }else{
            function isSubarray(a,of){
                for(let value of a){
                    if(!of.includes(value))return false;
                }
                return true;
            }
            let names=[];
            let validNames=[];
            let allinitialized=false;
            while(!isSubarray(validNames,names)||!allinitialized){
                //ask for as much as possible;
                names=queryRows("select id from coins where id like ? and initialized !=2 order by market_cap limit ?",['%'+name.toLowerCase()+'%',250]);
                names=names.map(a=>a.id);
                results={};
                for(let date of days){
                    date={year:date.getFullYear(),day:toYearDay(date)};
                    results[date.year+":"+date.day]=await fetchCoin.autoRange(names,date.year,date.day);
                }
                //some coins can be invalid, ask for valid ones
                validNames=queryRows("select id,initialized from coins where id like ? and initialized !=2 order by market_cap limit ?",['%'+name.toLowerCase()+'%',limit]);
                allinitialized=true;
                for(let i of validNames){
                    if(i.initialized==0){
                        allinitialized=false;
                        break;
                    }
                }
                validNames=validNames.map(a=>a.id);
            }
            for(let date of Object.values(results)){
                for(let coin in date){
                    if(!validNames.includes(coin)){
                        delete date[coin];//asked for 250, limit to "limit"
                    }
                }
            }
        }
        let packed={};
        for(let day in results){
            for(let coin in results[day]){
                if(packed[coin]==undefined){
                    packed[coin]={data:queryRow("select data from coins where id=?",[coin]),sparkline:{}};
                }
                packed[coin].sparkline[day]=results[day][coin];
            }
        }
        return packed;
    },
    autoRange:async function(coins=[""],year=2000,day=0,currency="usd"){
        console.log("autoRange"+JSON.stringify(coins)+year+day);
        let now=new Date();
        let today={year:now.getFullYear(),day:toYearDay(now),hour:now.getHours()};
        if(year>today.year||(year==today.year&&day>today.day)||year<1900||day<0)return false;
        //exceptions for "all"
        if(coins=="all"){
            coins=queryRows("select id from coins where initialized=1 order by market_cap limit 250");
            if(coins.length==0){//never initialized, cache will make this optimal
                await fetchCoin.newRange("all",currency);
                coins=queryRows("select id from coins where initialized=1 order by market_cap limit 250");
            }
            coins=coins.map(a=>a.id);
        }
        //get sparkline from cache
        let cache=coins.reduce( (a,coin)=>{a[coin]=fetchCoin.checkCache(coin,year,day);return a;},{} );
        let notCached=Object.entries(cache).reduce((a,cache)=>{if(cache[1]===false)a.push(cache[0]);return a;},[]);
        //update cache where needed
        if(notCached.length>=1){
            if(getDayDiff(fromYearDay(year,day),new Date())>89){
                await fetchCoin.oldRange(notCached,year,day,currency);
            }else{
                await fetchCoin.newRange(notCached,currency);
            }
        }
        for(let coinId of notCached){
            cache[coinId]=fetchCoin.checkCache(coinId,year,day);
        }
        return cache;
    },
    oldRange:async function(coins=[""],year=2000,day=0,currency="usd"){
        console.log("oldRange"+JSON.stringify(coins)+year+day);
        let from=fromYearDay(year,day);from=from.getTime()/1000;
        let to=fromYearDay(year,day+1);to=to.getTime()/1000;
        for(let coinId of coins){
            let range=await CoinGeckoClient.coins.fetchMarketChartRange(coinId,{vs_currency:currency,from,to});
            if(!range.success)throw new Error("coingecko is unavaliable");
            let days={};
            for(let price of range.data.prices){
                let date=new Date(price[0]);
                let tag=date.getFullYear()+":"+date.getHours();
                if(days[tag]==undefined)days[tag]=[];
                days[tag].push([date.getTime(),price]);
                date.setHours(date.getHours()-1);
            }
            if(Object.keys(days).length>0)fetchCoin.updateCache(coinId,"usd",day[0],day[1],{id:coinId, name:coin.name, prices, price:coin.current_price,market_cap:coin.market_cap,image:coin.image});
        }
    },
    newRange:async function(coins=[""],currency="usd",order="market_cap_desc"){
        console.log("newRange"+JSON.stringify(coins));
        async function getData(coinIds){
            let parameters={vs_currency:currency,order,sparkline:true,per_page:coinIds==undefined?250:coinIds.length};
            if(coinIds!=undefined)parameters['ids']=coinIds;
            let res=await CoinGeckoClient.coins.markets(parameters);
            if(!res.success)throw new Error("coingecko is unavaliable");
            let resolveme;
            let promise=new Promise((resolve)=>{resolveme=resolve});
            db.transaction(()=>{
                for(let coin of res.data){
                    if(coin.last_updated==null||coin.price_change_24h==null){//broken coin, forget about it
                        query(`update coins set initialized=? where id=?`,[2,coin.id]);
                        continue;
                    }
                    let date=new Date(coin.last_updated.replace(/Z+$/, ''));
                    date=new Date(date.getUTCFullYear(),date.getMonth(),date.getDate(),date.getHours());
                    let days={};
                    for(let price of coin.sparkline_in_7d.price){
                        let tag=date.getFullYear()+":"+toYearDay(date);
                        if(days[tag]==undefined)days[tag]=[];
                        days[tag].push([date.getTime(),price]);
                        date.setHours(date.getHours()-1);
                    }
                    let today=new Date();
                    let maxHours=today.getHours();
                    let thisDay=toYearDay(today);
                    if(days[date.getFullYear()+":"+thisDay]==undefined){
                        //dead coin
                        query(`update coins set initialized=? where id=?`,[2,coin.id]);
                        continue;
                    }
                    for(let last7=thisDay-6;last7<=thisDay;last7++){
                        if(days[date.getFullYear()+":"+last7]==undefined){
                            let tmp=structuredClone(Object.values(days)[0]);
                            let day=fromYearDay(date.getFullYear(),last7);
                            for(let i in tmp){
                                let a=new Date(tmp[i][0]);
                                a.setMonth(day.getMonth());
                                a.setDate(day.getDate());
                                tmp[i][0]=a.getTime();
                            }
                            days[date.getFullYear()+":"+last7]=tmp;
                        }
                    }
                    for(let tag in days){
                        let prices=days[tag];
                        let day=tag.split(":");
                        let today=fromYearDay(day[0],day[1]);
                        let maxHours=day[1]==thisDay?today.getHours():24;
                        if(prices.length<maxHours-1){
                            let last=prices[prices.length-1];
                            let Hprices=prices.reduce((a,b)=>{a[(new Date(b[0])).getHours()]=true;return a;},{});
                            for(let hr=0;hr<maxHours;hr++){
                                if(!Hprices[hr]){
                                    let date=new Date(last[0]);
                                    date.setHours(hr);
                                    prices.push([date.getTime(),last[1]]);
                                }
                            }
                        }
                        fetchCoin.updateCache(coin.id,"usd",day[0],day[1],{id:coin.id, name:coin.name, prices, price:coin.current_price, market_cap:coin.market_cap,image:coin.image});
                    }
                }
                resolveme();
            })();
            await promise;
        }
        if(coins=="all"){
            return await getData();
        }
        async function addUninitialized(addTo,rejectIds){
            //dont waste this api call, add some uninitialized ones to the list
            let init= queryRows("select id from coins where initialized=0 and id not in ("+Array(rejectIds.length).fill("?").join(',')+") limit "+(250-addTo.length),rejectIds);
            addTo.push(...init.map(a=>a.id));
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
        if(coins.length<=250){
            await addUninitialized(coins,coins);
            await getData(coins);
        }
    },
    saveImage:async function(coinId,image){
        let coin=queryRow(`select id,data where id=?`,[coinId]);
        if(coin.data.image==undefined){
            toolbox.fetchImage(coinId+".png",image);
        }
    },
    updateCache:(coinId="",currency="usd",year=2000,day=0,fetched)=>{
        //let fetched=await CoinGeckoClient.coins.fetchMarketChartRange(coin,{vs_currency:currency,from,to});
        let datapoints={};
        for(let datapoint of fetched.prices){
            let date=new Date(datapoint[0]);
            datapoints[datapoint[0]]={id:coinId,year:date.getFullYear(),day:toYearDay(date),hour:date.getHours(),price:datapoint[1]};
        }
        let coin=queryRow(`select data,price,market_cap,initialized from coins where id=?`,[fetched.id]);
        let datakeys=['image','description','hashing_algorithm','symbol'];
        let updatedData=false;
        for(let dk of datakeys){
            if(fetched[dk]!=undefined&&coin.data[dk]!=fetched[dk]){
                if(dk=="image"){
                    if(coin.data[dk]==undefined){
                        toolbox.fetchImage(fetched.id,fetched.image);
                        fetched[dk]="../babel-cache/images/250"+fetched.id;
                    }else continue;
                }
                coin.data[dk]=fetched[dk];
                updatedData=true;
            }
        }
        let updates={};
        if(updatedData)updates['data']=coin.data;
        if(coin.initialized!=1)updates['initialized']=1;
        if(fetched.price!=coin.price)updates['price']=fetched.price;
        if(fetched.market_cap!=coin.market_cap)updates['market_cap']=fetched.market_cap;
        if(Object.keys(updates).length>0){
            console.log("updateCache"+coinId+":"+Object.keys(updates).length);
            query(`update coins set `+Object.keys(updates).map(a=>a+"=?").join(',')+` where id=?`,[...Object.values(updates),fetched.id]);
        }
        datapoints=Object.values(datapoints);
        if(datapoints.length>0){
            let datamap={};
            for(let a of datapoints){
                datamap[a.id+':'+a.year+':'+a.day+':'+a.hour]=a;
            }
            let exists=queryRows("select id || ':' || year || ':' || day || ':' || hour AS key from coinsSparkline where id || ':' || year || ':' || day || ':' || hour in ("+Array(Object.keys(datamap).length).fill("?").join(',')+")",Object.keys(datamap));
            for(let dp of exists){
                delete datamap[dp.key];
            }
            datapoints=Object.values(datamap);
            if(datapoints.length>0)query(`insert into coinsSparkline (id,year,day,hour,price) values `+Array(datapoints.length).fill("(?,?,?,?,?)").join(','),datapoints.reduce((o,i)=>{o.push(...Object.values(i));return o},[]));
        }
        return Object.values(datapoints);
    },
    refreshList:async function(){
        let list=queryRows("select id,data from coins");
        for(let coin of list){
            if(coin.data.image){
                toolbox.access(coin.data.image).then((exists)=>{
                    if(!exists){
                        delete coin.data.image;
                        query("update coins set data=? where id=?",[coin.data,coin.id]);
                    }
                })
            }
        }
        list=list.reduce((o,i)=>{o[i.id]=true;return o},{});
        let freshList=await CoinGeckoClient.coins.list();
        if(!freshList.success){
            console.log("Nie można nawiązać połączenia z coingecko");
            return;
        }
        freshList=freshList.data;
        let missing=[];
        for(let coin of freshList){
            if(!list[coin.id])missing.push([coin.id,coin.name,-1,-1,{},0]);
        }
        for(let i=0;i<missing.length;i+=250){
            let part_misssing=missing.slice(i,i+250);
            query("insert into coins (id,name,price,market_cap,data,initialized) values "+Array(part_misssing.length).fill("(?,?,?,?,?,?)").join(','),part_misssing.reduce((o,i)=>{o.push(...i);return o},[]));
        }
        
    }
}
fetchCoin.refreshList();
export default {query,queryRow,queryBulk,config,fetchCoin}