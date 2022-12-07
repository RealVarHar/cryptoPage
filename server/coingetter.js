import CoinGecko from 'coingecko-api';
//import toolbox from './toolbox.js';
CoinGecko.TIMEOUT=600000;
const CoinGeckoClient2 = new CoinGecko();
function traceMethodCalls(obj) {
    let handler = {
        get(target, propKey, receiver) {
            return async function (...args) {
                try{
                    return await target[propKey].apply(this, args);
                }catch{
                    return {success:false};
                }
            };
        }
    };
    return new Proxy(obj, handler);
}
let CoinGeckoClient={coins:traceMethodCalls(CoinGeckoClient2.coins)};
function logApi(calltype){
    console.log(new Error().stack.split('\n')[2].split('file://')[1],fethes.used,fethes.scheduled.length);
}
function updateCoin(coin){
    let keys=['last_update','last_sparkline_update','price','data'];
    if(coin['data']!=undefined){
        let data=database.queryRow("select data from coins where id=?",coin.id).data;
        for(let key in coin.data){
            data[key]=coin.data[key];
        }
        coin.data=data;
    }
    let q=[],q2=[];
    for(let key of keys){
        if(coin[key]!=undefined){
            q.push(key+'=?');q2.push(coin[key]);
        }
    }
    q=q.join(',');q2.push(coin.id);
    if(q.length>0)database.query("update coins set "+q+" where id=?",q2);
    if(coin.sparkline!=undefined){
        let insert=[];
        for(let date in coin.sparkline){
            let day=date.split(':');
            let year=day[0];day=day[1];
            insert.push(coin.id,year,day,coin.sparkline[date]);
        }
        if(insert.length>0)database.query("insert into coinsSparkline (id,year,day,prices) values "+toolbox.qrepeat("(?,?,?,?)",Object.values(coin.sparkline).length)+" on conflict(id,year,day) do update set prices=excluded.prices",insert);
    }
}
async function getTempCoin(ids=[]){
    if(ids.length>250||fethes.used>=fethes.max)return false;
    //return coins like checkcache would return. sparkline can be wrong
    function classifyDates(sparkline){
        let days={};
        let date=new Date();
        date=new Date(date.getUTCFullYear(),date.getMonth(),date.getDate(),date.getHours());
        for(let price of sparkline){
            let tag=date.getFullYear()+":"+toolbox.toYearDay(date);
            if(days[tag]==undefined)days[tag]={};
            days[tag][date.getHours()]=price;
            date.setHours(date.getHours()-1);
        }
        date=new Date();
        date=new Date(date.getUTCFullYear(),date.getMonth(),date.getDate(),date.getHours());
        let to=date.getFullYear()+':'+toolbox.toYearDay(date);date.setDate(date.getDate()-7);
        let from=date.getFullYear()+':'+toolbox.toYearDay(date);
        let lastUpdate;
        if(Object.keys(days).length==0){
            lastUpdate=0;
        }else{
            let min=toolbox.fromYearDay(...Object.keys(days)[0].split(':')).getTime();
            for(let day in days){
                let curr=toolbox.fromYearDay(...day.split(':')).getTime();
                if(curr<min)min=curr;
            }
            min=new Date(min);min=min.getFullYear()+':'+toolbox.toYearDay(min);
            lastUpdate=days[min][Math.min(Object.keys(days[min]))];
        }
        for(let day of toolbox.dayWalker(from,to)){
            let dataDay=days[day];
            if(dataDay==undefined){
                days[day]=Array(24).fill(lastUpdate);
                continue;
            }
            for(let i=0;i<24;i++){
                if(dataDay[i]!=undefined){
                    lastUpdate=dataDay[i];
                }else{
                    dataDay[i]=lastUpdate;
                }
            }
            days[day]=Object.values(days[day]);//arrays take less memory than equivalent objects
        }
        return days;
    }
    let parameters={vs_currency:"usd",sparkline:true,per_page:ids.length==0?250:ids.length,price_change_percentage:"1h,24h,7d"};
    if(ids.length!=0)parameters['ids']=ids;
    fethes.used++;
    logApi();
    let res=await CoinGeckoClient.coins.markets(parameters);
    if(!res.success)throw new Error("coingecko is unavaliable");
    //extract coin ()
    let coins=[];
    for(let row of res.data){
        coins.push({
            id:row.id,
            last_update:Math.floor((new Date()).getTime()/60000),
            price:row.current_price,market_cap:row.market_cap,
            data:{
                image:row.image.replace(/\?\d*$/,''),
                name:row.name,symbol:row.symbol,
                price_change_percentage_1h_in_currency:row.price_change_percentage_1h_in_currency,
                price_change_percentage_24h_in_currency:row.price_change_percentage_24h_in_currency,
                price_change_percentage_7d_in_currency:row.price_change_percentage_7d_in_currency,
                market_cap_rank:row.market_cap_rank,
                total_volume:row.total_volume
            },
            sparkline:classifyDates(row.sparkline_in_7d.price)
        });
    }
    return coins;
}
async function getPersistantCoin(id="",uptoDate){
    if(id=="")return;
    //lets start easy, download last 3 months,excluding days present in database
    function classifyDates(sparkline){
        let days={};
        for(let price of sparkline){
            let day=new Date(price[0]);
            let tag=day.getFullYear()+":"+toolbox.toYearDay(day);
            if(days[tag]==undefined)days[tag]={};
            days[tag][day.getHours()]=price[1];
        }
        if(Object.keys(days).length==0)return {};
        let min=toolbox.fromYearDay(...Object.keys(days)[0].split(':')).getTime(),max=min;
        for(let day in days){
            let curr=toolbox.fromYearDay(...day.split(':')).getTime();
            if(curr<min)min=curr;
            if(curr>max)max=curr;
        }
        min=new Date(min);min=min.getFullYear()+':'+toolbox.toYearDay(min);
        max=new Date(max);max=max.getFullYear()+':'+toolbox.toYearDay(max);
        let lastUpdate=days[min][Math.min(Object.keys(days[min]))];
        for(let day of toolbox.dayWalker(min,max)){
            let dataDay=days[day];
            if(dataDay==undefined){
                days[day]=Array(24).fill(lastUpdate);
                continue;
            }
            for(let i=0;i<24;i++){
                if(dataDay[i]!=undefined){
                    lastUpdate=dataDay[i];
                }else{
                    dataDay[i]=lastUpdate;
                }
            }
            days[day]=Object.values(days[day]);//arrays take less memory than equivalent objects
        }
        return days;
    }
    let to=new Date();
    let last3months=new Date(to.getUTCFullYear(),to.getMonth(),to.getDate()-89).getTime()/1000;
    let sparkline=[];
    if(uptoDate==undefined){
        uptoDate=database.queryRow("select last_sparkline_update from coins where id=?",[id]).last_sparkline_update;
        if(uptoDate==0)uptoDate=last3months;
    }else{
        if(uptoDate*60<last3months){
            //make a separate call for old values, as only 1/day values will be returned
            fethes.used++;
            logApi();
            let range=await CoinGeckoClient.coins.fetchMarketChartRange(id,{vs_currency:"usd",from:uptoDate*60,to:last3months});
            if(!range.success){
                console.log("coingecko is unavaliable");
                return;
            }
            sparkline=classifyDates(range.data.prices);
            uptoDate=last3months;
        }
    }
    to=to.getTime()/1000;
    fethes.used++;
    logApi();
    let range=await CoinGeckoClient.coins.fetchMarketChartRange(id,{vs_currency:"usd",from:uptoDate,to});
    if(!range.success){
        console.log("coingecko is unavaliable");
        return;
    }
    let cd=classifyDates(range.data.prices);
    for(let date in cd){
        if(sparkline[date]==undefined){
            sparkline[date]=cd[date];
        }else{
            let day=cd[date];
            for(let h in day)sparkline[date][h]=day[h];
        }
    }
    let coin={
        id,
        sparkline:cd,
        last_sparkline_update:Math.floor((new Date()).getTime()/60000),
    };
    updateCoin(coin);
    return coin;
}
function limitSparkline(sparkline,days){
    let repack={};
    let missingDates=[];
    let newestDate=0;
    for(let day of days){
        let tag=new Date(day);
        tag=tag.getFullYear()+":"+toolbox.toYearDay(tag);
        let spark=sparkline[tag];
        if(spark==undefined){
            missingDates.push(tag);
            if(Math.floor(day.getTime()/60000)>newestDate)newestDate=Math.floor(day.getTime()/60000);
            repack[tag]=Array(24).fill(0);
        }else{
            repack[tag]=spark;
        }
    }
    return {repack,missingDates,newestDate};
}
function getCache(coinId,days=[],newestDate,last_sparkline_update){
    if(newestDate==undefined){
        if(typeof(days[0])=="number"){
            newestDate=Math.max(...days)/60000;
        }else{
            newestDate=Math.max(...days.map(x=>
                toolbox.fromYearDay(...x.split(':')).getTime()
            ))/60000;
        }
    }
    if(typeof(days[0])=="number"){
        for(let key in days){
            let day=new Date(days[key]);
            days[key]=[days[key]/60000,day.getFullYear()+":"+toolbox.toYearDay(day)];
        }
    }else{
        for(let key in days){
            days[key]=[toolbox.fromYearDay(...days[key].split(':')).getTime()/60000,days[key]];
        }
    }
    if(last_sparkline_update==undefined){
        last_sparkline_update=database.queryRow("select last_sparkline_update from coins where id=?",[coinId]).last_sparkline_update;
    }
    if(newestDate>last_sparkline_update){
        //query refresh
        fethes.scheduled.push([getPersistantCoin,[coinId]]);
    }
    //now filter out days that are >>last_sparkline_update
    days=days.filter(a=>a[0]<last_sparkline_update).map(a=>a[1]);
    let cache;if(days.length>0){
        cache=database.queryRows("select year,day,prices from coinsSparkline where id=? and ( year || day ) in ("+toolbox.qrepeat('?',days.length)+")",[coinId,...days]);
    }else cache=[];
    let sparkline={};
    for(let entry of cache){
        sparkline[entry.year+":"+entry.day]=entry.prices;
    }
    return sparkline;
}
async function getcoins(ids=[],days){
    //get all info about coins
    let lastminute=new Date();
    lastminute=Math.floor(lastminute.getTime()/60000);//update every minute
    let lastday=Math.floor(lastminute/1440);
    let coins;
    if(typeof(ids)=='string'){
        coins=database.queryRows("select id,last_update,last_sparkline_update,price,market_cap, data from coins where id like '%"+ids+"%' limit 250",[]);
    }else{
        coins=database.queryRows("select id,last_update,last_sparkline_update,price,market_cap, data from coins where id in ("+toolbox.qrepeat('?',ids.length)+") limit 250",ids);
    }
    let oldCoins=coins.filter(a=>a.last_update<lastminute||a.last_sparkline_update<lastday).map(a=>a.id);
    if(oldCoins.length>0){
        let awaitingupdate=database.queryRows("select id from coins where last_update<? order by market_cap limit ?",[lastminute,250]).filter(a=>!oldCoins.includes(a.id));
        let updateCoins=await getTempCoin(oldCoins.concat(awaitingupdate.slice(0,250-oldCoins.length)));
        let map={};
        for(let coin of updateCoins){
            map[coin.id]=coin;
            let coinToUpdate=structuredClone(coin);
            delete coinToUpdate.sparkline;
            updateCoin(coinToUpdate);
        }
        for(let key in coins){
            let coin=coins[key];
            if(map[coin.id]!=undefined){
                coins[key]=map[coin.id];
            }
        }
    }
    for(let coin of coins){
        //combine sparkline or use one of them depending on days
        let combine=limitSparkline(coin.sparkline,days);
        coin.sparkline=combine.repack;
        let cache=getCache(coin.id,combine.missingDates,combine.newestDate,coin.last_sparkline_update);
        for(let key in cache){
            coin.sparkline[key]=cache[key];
        }
    }
    return coins;
}
async function refreshList(){
    if(fethes.used>=fethes.max)fethes.scheduled.push([refreshList]);
    let list=database.queryRows("select id,data from coins");
       for(let coin of list){
           if(coin.data.image){
            toolbox.access(coin.data.image).then((exists)=>{
                if(!exists){
                    delete coin.data.image;
                    database.query("update coins set data=? where id=?",[coin.data,coin.id]);
                }
            })
        }
    }
    list=list.reduce((o,i)=>{o[i.id]=true;return o},{});
    fethes.used++;
    logApi();
    let freshList=await CoinGeckoClient.coins.list();
    if(!freshList.success){
        console.log("Nie można nawiązać połączenia z coingecko");
        return;
    }
    freshList=freshList.data;
    let missing=[];
    for(let coin of freshList){
        if(!list[coin.id])missing.push([coin.id,0,0,0,0,{}]);
    }
    for(let i=0;i<missing.length;i+=250){
        let part_misssing=missing.slice(i,i+250);
        database.query("insert into coins (id,last_update,last_sparkline_update,price,market_cap, data) values "+toolbox.qrepeat("(?,?,?,?,?,?)",part_misssing.length),part_misssing.reduce((o,i)=>{o.push(...i);return o},[]));
    }
}
//sheduler function used beause of time and api calls restrictions
async function askforCoin(){
    //ask for new coins in a loop
    fethes.used--;
    if(fethes.used<0)fethes.used=0;
    if(fethes.running)return;
    fethes.running=true;
    if(fethes.scheduled.length>0&&fethes.used<fethes.maxrisk){//fetch sparkline for scheduled coin
        while(fethes.used<fethes.maxrisk){
            await fethes.scheduled[0][0](...fethes.scheduled[0][1]);
            fethes.scheduled.splice(0,1);
        }
    }else if(fethes.used==0){//feth a random coin
        let lastday=new Date();
        lastday=Math.floor(lastday.getTime()/60000)-1440;//update in background only coins older than a day
        let coinsToUpdate=database.queryRow("select id from coins where last_update>0 and last_sparkline_update>? order by last_update desc limit 1",[lastday]);
        if(coinsToUpdate!=undefined)await getPersistantCoin(coinsToUpdate.id);
    }
    fethes.running=false;
    fethes.clock=setTimeout(askforCoin,60000/fethes.max);
}
let fethes={used:0,max:10,maxrisk:1,clock:0,scheduled:[],running:false}
fethes.clock=setTimeout(askforCoin,60000/fethes.max);
async function getDefault250(){
    //returns names of any 250 sorted by marketcap
    let lastminute=new Date();
    lastminute=Math.floor(lastminute.getTime()/60000);//update every minute
    let coins=database.queryRows("select id from coins where last_update!=0 order by market_cap limit 250").map(a=>a.id);
    if(coins.length<250){
        let coindata=await getTempCoin();//getMarkets
        for(let coin of coindata)updateCoin(coin);
        coins=coindata.map(a=>a.id);
        return coins;
    }
    return coins;
}
async function search(names=null,limit=250,days=[]){
    console.log("search"+names+limit+JSON.stringify(days));
    if(names==null)names="";
    if(limit==null)limit=250;
    if(days==null)days=[];
    if(days.length==0){
        let day=new Date();
        for(let i=0;i<7;i++){
            days.push(new Date(day));
            day.setDate(day.getDate()-1);
        }
    }
    database.query("BEGIN TRANSACTION");
    if(names.length==0){
        names=await getDefault250();
    }
    let result=await getcoins(names,days);
    database.query("COMMIT TRANSACTION");
    result=result.sort((a,b)=>b.market_cap-a.market_cap).slice(0,limit);
    return result;
}
export default {search,refreshList};