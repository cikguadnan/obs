gsap.registerPlugin(ScrollTrigger);

// Intro: a deliberate first impression.
const load=gsap.timeline();
load.to('.loader-line i',{width:'100%',duration:.8,ease:'power2.inOut'})
    .to('.loader-mark',{y:-20,opacity:0,duration:.45,ease:'power2.in'},'+=.1')
    .to('.loader>span,.loader-line',{opacity:0,duration:.25},'<')
    .to('.loader',{yPercent:-100,duration:.85,ease:'power4.inOut'})
    .from('.hero h1 b',{yPercent:115,stagger:.12,duration:1.15,ease:'power4.out'},'-=.25')
    .from('.hero-kicker,.hero-bottom',{opacity:0,y:20,stagger:.08,duration:.7},'-=.65');

// Global progress.
gsap.to('.progress i',{scaleX:1,ease:'none',scrollTrigger:{trigger:'body',start:'top top',end:'bottom bottom',scrub:.15}});

// Custom cursor on fine pointers.
if(matchMedia('(pointer:fine)').matches){
 const c=document.querySelector('.cursor'); let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
 addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
 gsap.ticker.add(()=>{cx+=(mx-cx)*.18;cy+=(my-cy)*.18;gsap.set(c,{x:cx,y:cy})});
 document.querySelectorAll('a,.work').forEach(el=>{el.addEventListener('mouseenter',()=>gsap.to(c,{scale:1.8,duration:.25}));el.addEventListener('mouseleave',()=>gsap.to(c,{scale:1,duration:.25}))});
}

// Opening scene compresses while the colour field takes over.
const hero=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom bottom',scrub:1}});
hero.to('.hero h1',{scale:.58,y:-100,opacity:.12,ease:'none'},0)
 .to('.glow-one',{scale:2.15,x:'-30vw',y:'20vh',rotation:80,ease:'none'},0)
 .to('.glow-two',{scale:3.2,x:'30vw',y:'-20vh',ease:'none'},0)
 .to('.hero-kicker,.hero-bottom',{opacity:0,ease:'none'},.1);

// Manifesto kinetic typography.
gsap.from('.statement h2',{y:120,opacity:0,duration:1.2,ease:'power4.out',scrollTrigger:{trigger:'.statement h2',start:'top 82%'}});
gsap.to('.asterisk',{rotation:240,ease:'none',scrollTrigger:{trigger:'.statement',start:'top bottom',end:'bottom top',scrub:1}});
gsap.from('.statement p',{x:100,opacity:0,duration:1,scrollTrigger:{trigger:'.statement p',start:'top 85%'}});

// Circular portal grows beyond the viewport and becomes a world.
const lens=gsap.timeline({scrollTrigger:{trigger:'.lens',start:'top top',end:'bottom bottom',scrub:1}});
lens.to('.lens-window',{width:'115vw',height:'115vw',borderRadius:'0%',ease:'power2.inOut'},0)
    .to('.planet',{scale:1.8,x:'-12vw',y:'15vh',rotation:35,ease:'none'},0)
    .fromTo('.world-type',{scale:.35,opacity:0},{scale:1.15,opacity:1,ease:'none'},.05)
    .to('.world-grid',{rotation:8,scale:2.1,ease:'none'},0)
    .to('.lens-label',{opacity:0,ease:'none'},.15)
    .to('.orbit-copy',{opacity:1,y:20,ease:'none'},.5)
    .to('.world-type',{x:'22vw',ease:'none'},.55);

// Marquee drifts continuously with scroll direction.
gsap.to('.ticker div',{xPercent:-35,ease:'none',scrollTrigger:{trigger:'.ticker',start:'top bottom',end:'bottom top',scrub:1}});

// Vertical wheel becomes a horizontal gallery.
const track=document.querySelector('.track');
const distance=()=>Math.max(0,track.scrollWidth-innerWidth+innerWidth*.05);
gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:'.works',start:'top top',end:'bottom bottom',scrub:.75,invalidateOnRefresh:true}});
document.querySelectorAll('.work').forEach((card,i)=>gsap.from(card,{y:i%2?80:160,rotation:i%2?2:-2,ease:'none',scrollTrigger:{trigger:'.works',start:'top 70%',end:'top 10%',scrub:1}}));

// Massive type changes scale and spacing as the visitor moves through it.
const mega=gsap.timeline({scrollTrigger:{trigger:'.interlude',start:'top top',end:'bottom bottom',scrub:1}});
mega.fromTo('.mega',{scale:.48,rotation:-4},{scale:1.22,rotation:2,ease:'none'},0)
    .fromTo('.mega span:nth-child(1)',{x:'35vw'},{x:'-18vw',ease:'none'},0)
    .fromTo('.mega span:nth-child(2)',{x:'-35vw'},{x:'14vw',ease:'none'},0)
    .fromTo('.mega span:nth-child(3)',{x:'20vw'},{x:'-10vw',ease:'none'},0)
    .to('.floating-disc',{x:'-65vw',y:'-45vh',rotation:420,ease:'none'},0);

// Quote scene.
gsap.from('.quote h2',{y:140,opacity:0,scale:.9,duration:1.25,ease:'power4.out',scrollTrigger:{trigger:'.quote h2',start:'top 82%'}});
gsap.to('.quote-orb',{y:-160,rotation:50,scale:1.25,ease:'none',scrollTrigger:{trigger:'.quote',start:'top bottom',end:'bottom top',scrub:1}});

// Finale reveal.
gsap.from('.contact h2',{y:130,opacity:0,duration:1.3,ease:'power4.out',scrollTrigger:{trigger:'.contact',start:'top 60%'}});

// Magnetic project button.
const magnetic=document.querySelector('.magnetic');
if(magnetic&&matchMedia('(pointer:fine)').matches){magnetic.addEventListener('mousemove',e=>{const r=magnetic.getBoundingClientRect();gsap.to(magnetic,{x:(e.clientX-r.left-r.width/2)*.28,y:(e.clientY-r.top-r.height/2)*.28,duration:.3})});magnetic.addEventListener('mouseleave',()=>gsap.to(magnetic,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}))}

addEventListener('resize',()=>ScrollTrigger.refresh());