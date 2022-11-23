import fs from 'fs';
import http from 'http';
import https from 'https';
import sharp from 'sharp';
import Stream from 'stream';
function getDayDiff(start,now){
    let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    let oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
function toYearDay(year,month,day){
    let now;
    if(typeof(year)=='object'){
        now=year;
        year=now.getFullYear();
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
async function mkdir(url){
    try {
        await fs.promises.mkdir(url, { recursive: true });
    } catch {return false;}
    return true;
}
async function access(url){
    try {
        await fs.promises.access(url);
    } catch {return false;}
    return true;
}
let getters={
    array:function(str,options){
        if(typeof(str)=='string'){
            try{
                str=JSON.parse(str);
            }catch{return null;}
        }
        if(!Array.isArray(str))return null;
        for(let option of options){
            output=[];
            let res=null;
            for(let item of str){
                if(typeof(option)=='object'){
                    res=getters.array(item,option);
                }else{
                    res=getters[option](str);
                }
                if(res==null){
                    output=null;break;
                }else{
                    output.push(res);
                }
            }
            if(output!=null)break;
        }
        return output;
    },
    string:function(str){
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
        str=getters.float(str);
        let str2=parseInt(str);
        if(str!=str2)return null;
        return str2;
    },
    date:function(str){
        //check if this is a date
        str=new Date(str);
        if(isNaN(str))return null;
        return str;
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
mkdir("../babel-cache/images");
async function fetchImage(name,url){
    return url;//skip getting images until a good cache is mage
    var client = http;
    if (url.indexOf("https") === 0){
        client = https;
    }
    await new Promise((resolve)=>{
        try{
            client.request(url, function(response) {
                var data = new Stream.Transform();
                response.on('data', function(chunk) {data.push(chunk);});
                response.on('end', function() {
                data=data.read();
                    let all=[];
                    all.push(sharp(data).resize(250,250).toFile("../babel-cache/images/250"+name));
                    all.push(sharp(data).resize(50,50).toFile("../babel-cache/images/50"+name));
                    Promise.all(all).then(resolve);
                });
            }).end();
        }catch(e){
            console.log(url);
            console.log(e);
        }
        
    });
    return "/babel-cache/images/250"+name;
}
export default {getters,mkdir,fromYearDay,toYearDay,getDayDiff,fetchImage,access};