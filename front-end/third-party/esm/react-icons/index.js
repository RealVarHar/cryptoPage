let imported={};
let importfiles={ci:["ci"],fa:["fa"],io:["io","io5"],md:["md"],ti:["ti"],go:["go"],fi:["fi"],gi:["gi"],wi:["wi"],di:["di"],ai:["ai"],bs:["bs"],ri:["ri"],fc:["fc"],gr:["gr"],hi:["hi"],si:["si"],sl:["sl"],im:["im"],bi:["bi"],cg:["cg"],vs:["vsc"],tb:["tb"],tf:["tfi"]};
export default async function importer(name){
    let initials=name.substr(0,2).toLowerCase();
    if(imported[initials]!=undefined)return imported[initials][name];
    if(importfiles[initials]==undefined)throw new Error();
    let awaitall=[];
    let resolved=[];
    for(let file of importfiles[initials]){
        let i=awaitall.length;
        awaitall[i]=new Promise((resolve)=>{
            import('./dict/'+file+".js").then((resp)=>{
                resolved[i]=resp;
                resolve();
            })
        });
    }
    await Promise.all(awaitall);
    imported[initials]=Object.assign({},...resolved);
    return imported[initials][name];
}