gsap.registerPlugin(ScrollTrigger);

// Reading progress
gsap.to('.progress span',{scaleX:1,ease:'none',scrollTrigger:{trigger:'body',start:'top top',end:'bottom bottom',scrub:.15}});

// Hero transforms as the opening scene stays pinned
const hero=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom bottom',scrub:1}});
hero.to('.hero h1',{scale:.68,y:-80,opacity:.22,ease:'none'},0)
    .to('.orb-a',{scale:1.65,x:-120,y:80,rotation:35,ease:'none'},0)
    .to('.orb-b',{scale:2.4,x:160,y:-100,ease:'none'},0)
    .to('.hero-copy',{y:-70,opacity:0,ease:'none'},0);

// Text changes from quiet grey to solid ink as it enters
ScrollTrigger.create({trigger:'.reveal-text',start:'top 78%',end:'bottom 35%',scrub:true,onUpdate:self=>{
  const p=self.progress; const v=Math.round(201-(184*p));
  document.querySelector('.reveal-text').style.color=`rgb(${v},${v},${Math.max(17,v-8)})`;
}});

// Small window expands into an immersive scene
const portal=gsap.timeline({scrollTrigger:{trigger:'.portal',start:'top top',end:'bottom bottom',scrub:1}});
portal.to('.portal-frame',{width:'100vw',height:'100vh',borderRadius:0,ease:'power1.inOut'},0)
      .fromTo('.portal-world p',{scale:.55,opacity:.3},{scale:1.15,opacity:1,ease:'none'},0)
      .to('.sun',{scale:1.35,y:80,ease:'none'},0)
      .to('.portal-caption',{opacity:0,ease:'none'},.25);

// Vertical scroll moves a row of panels sideways
const track=document.querySelector('.track');
function horizontalDistance(){return Math.max(0,track.scrollWidth-window.innerWidth+window.innerWidth*.05)}
gsap.to(track,{x:()=>-horizontalDistance(),ease:'none',scrollTrigger:{trigger:'.horizontal',start:'top top',end:'bottom bottom',scrub:.7,invalidateOnRefresh:true}});

// Oversized type crosses the frame
const typeTl=gsap.timeline({scrollTrigger:{trigger:'.type-scene',start:'top top',end:'bottom bottom',scrub:1}});
typeTl.fromTo('.giant-type',{x:'32vw',scale:.65},{x:'-42vw',scale:1.12,ease:'none'},0)
      .fromTo('.type-note',{opacity:0,y:30},{opacity:1,y:0,ease:'none'},.55);

// Finale details
gsap.from('.finale h2',{y:100,opacity:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.finale',start:'top 65%'}});
gsap.to('.finale-orb',{y:-90,rotation:20,ease:'none',scrollTrigger:{trigger:'.finale',start:'top bottom',end:'bottom top',scrub:1}});

window.addEventListener('resize',()=>ScrollTrigger.refresh());