(()=>{
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(reduced||!window.gsap)return;
 const gsap=window.gsap;
 gsap.from(".bar",{y:-18,opacity:0,duration:.7,ease:"power2.out"});
 gsap.from(".hero-copy > *",{y:24,opacity:0,duration:.8,stagger:.11,ease:"power3.out",delay:.12});
 gsap.from(".hero-visual",{y:30,opacity:0,rotate:1.5,duration:1,ease:"power3.out",delay:.3});
 if(!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 gsap.utils.toArray("section:not(.hero) .section-kicker, section:not(.hero) h2, section:not(.hero) .section-heading p").forEach(el=>{
   gsap.from(el,{y:22,opacity:0,duration:.7,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});
 });
 gsap.utils.toArray(".gallery figure,.plan,.rules li,.faq-list details,.contact-links>*").forEach((el,i)=>{
   gsap.from(el,{y:20,opacity:0,duration:.55,delay:(i%3)*.06,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 92%",once:true}});
 });
 gsap.from(".explorer",{y:26,opacity:0,duration:.8,scrollTrigger:{trigger:".explorer",start:"top 85%",once:true}});
})();