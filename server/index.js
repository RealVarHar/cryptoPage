import process from 'node:process';
import fastify from 'fastify';
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
app.post('/app',async (req,res) => {
    res.statusCode=200;
    res.send();
});
app.get('/app',async (req,res) => {
    res.statusCode=200;
    res.send();
});
//default routes. keep at the end of the route definitions
app.all('*',(req,res) => {
    res.statusCode=404;
    res.send();
});
app.listen({port: arg.httpsPort,host: arg.ip},() => {
    console.log(`Worker ${process.pid} started`)
});
