'use strict';
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('node:path');
const app = express();
const PORT = Number(process.env.PORT || 3000);
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: { directives: {
  defaultSrc: ["'self'"], scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
  imgSrc: ["'self'", 'data:'], fontSrc: ["'self'", 'data:'], connectSrc: ["'self'"],
} } }));
app.use(express.json({limit:'32kb'}));
app.use('/api', rateLimit({windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false}));
const products = [
 ['Kablosuz Bluetooth Kulaklık','Elektronik',899.00,1],['Dijital Hava Fritözü 5.5 L','Elektronik',2499.00,2],['Çok Amaçlı Saklama Kabı Seti','Ev & Yaşam',189.90,3],['Ergonomik Çalışma Lambası','Ev & Yaşam',349.00,4],['Pamuklu Basic Tişört','Giyim & Aksesuar',179.90,5],['Katlanabilir Kamp Sandalyesi','Outdoor',499.00,6],['Şarjlı El Süpürgesi','Elektronik',799.00,7],['Seramik Kupa 2’li Set','Ev & Yaşam',129.90,8],['Çocuklar İçin Ahşap Bloklar','Anne & Bebek',229.00,9],['Termos 500 ml','Ev & Yaşam',249.90,10],['LED Masa Lambası','Elektronik',399.00,11],['Mutfak Düzenleyici Raf','Ev & Yaşam',159.90,12],
].map(([name,category,price,n],i)=>({id:i+1,name,category,price,image:`/assets/products/product-${String(n).padStart(2,'0')}.${n===1||n===2||n===4||n===6||n===8||n===10||n===11||n===12?'jpg':'jpg'}`,badge:i%3===0?'ÇOK SATAN':i%3===1?'FIRSAT':'',oldPrice:Math.round(price*1.22*100)/100}));
app.get('/api/products',(req,res)=>{
 const q=String(req.query.q||'').trim().toLocaleLowerCase('tr-TR');
 const category=String(req.query.category||'').trim();
 let list=products.filter(p=>(!q||p.name.toLocaleLowerCase('tr-TR').includes(q)||p.category.toLocaleLowerCase('tr-TR').includes(q))&&(!category||category==='Tümü'||p.category===category));
 const sort=String(req.query.sort||'recommended');
 if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
 if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
 res.json({items:list,total:list.length});
});
app.use(express.static(path.join(__dirname,'public'),{maxAge:'1h'}));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`Storefront ready: http://127.0.0.1:${PORT}`));
