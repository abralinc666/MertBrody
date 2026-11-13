const P=[
['pragmatic','Pragmatic Play','Dünyanın en popüler sağlayıcısı','Dünyanın en sevilen slotları burada.'],
['evolution','Evolution','Live Casino’nun lideri','Canlı casino deneyiminin lideri.'],
['playngo','Play’n GO','Efsanevi oyun deneyimi','Efsanevi oyun deneyimi.'],
['bet365','bet365','Güvenilir casino deneyimi','Güvenilir casino deneyimi.'],
['micro','Microgaming','Klasik ve modern oyunlar','Klasik ve modern oyunlar.'],
['hacksaw','Hacksaw Gaming','Yenilikçi oyunlar','Yenilikçi oyunlar.'],
['elk','ELK Studios','Kaliteli oyunlar','Kaliteli oyunlar.'],
['netent','NetEnt','Premium içerik','Premium içerik.'],
['push','Push Gaming','Yüksek kaliteli slotlar','Yüksek kaliteli slotlar.'],
['relax','Relax Gaming','Sade ve yenilikçi','Sade ve yenilikçi.']].map(a=>({id:a[0],name:a[1],tagline:a[2],about:a[3]}));
// [provider, name, category, isNew, hue]
const raw=[
['pragmatic','Gates of Olympus','slots',1,255],['pragmatic','Sweet Bonanza','slots',1,320],['pragmatic','Wolf Gold','slots',0,220],
['pragmatic','The Dog House','slots',0,25],['pragmatic','Big Bass Bonanza','slots',0,170],['pragmatic','Starlight Princess','slots',0,285],['pragmatic','Sugar Rush','slots',1,335],
['evolution','Lightning Roulette','live',0,40],['evolution','Crazy Time','live',1,350],['evolution','Infinite Blackjack','live',0,150],
['playngo','Book of Dead','slots',0,35],['playngo','Reactoonz','slots',0,300],
['bet365','Blackjack Classic','table',0,140],['bet365','European Roulette','table',0,0],
['micro','Mega Moolah','slots',0,50],['micro','Immortal Romance','slots',0,345],
['hacksaw','Wanted Dead or a Wild','slots',1,20],['hacksaw','Chaos Crew','slots',0,270],
['elk','Wild Toro','slots',0,10],['netent','Starburst','slots',0,230],['netent','Gonzo’s Quest','slots',0,95],
['push','Razor Shark','slots',0,200],['push','Jammin’ Jars','slots',0,310],
['relax','Money Train 3','slots',1,15],['relax','Dream Drop','slots',0,260]];
const slug=s=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const games=raw.map(r=>({id:slug(r[1]),provider:r[0],name:r[1],category:r[2],isNew:!!r[3],hue:r[4]}));
P.forEach(p=>p.gameCount=games.filter(g=>g.provider===p.id).length);
const promotions=[
{id:'welcome',title:'Hoş Geldin Bonusu',desc:'Hesabına 500 sanal kredi hediye.',bonus:50000},
{id:'cashback',title:'Haftalık Nakit İade',desc:'Haftalık iade olarak 250 sanal kredi.',bonus:25000},
{id:'freespins',title:'Ücretsiz Dönüşler',desc:'Seçili slotlar için 100 sanal kredi.',bonus:10000}];
module.exports={providers:P,games,promotions};
