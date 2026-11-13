// Basit JSON dosya veritabanı: bellekte tutar, atomik yazar.
const fs=require('fs'),path=require('path');
const FILE=path.join(__dirname,'data','db.json');
let db={users:[],tx:[],favs:{},claims:{},notifs:[]};
try{db={...db,...JSON.parse(fs.readFileSync(FILE,'utf8'))}}catch{}
let t=null;
function save(){clearTimeout(t);t=setTimeout(flush,100)}
function flush(){const tmp=FILE+'.tmp';fs.writeFileSync(tmp,JSON.stringify(db));fs.renameSync(tmp,FILE)}
process.on('exit',()=>{try{flush()}catch{}});
['SIGINT','SIGTERM'].forEach(s=>process.on(s,()=>process.exit(0)));
module.exports={db,save};
