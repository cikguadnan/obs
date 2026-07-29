(() => {
  const DEMO = [
    {id:"1",name:"Alya",className:"3G3",momentType:"High moment",experience:"I was nervous during kayaking but my team encouraged me to keep paddling.",feelings:"Nervous at first, then proud and relieved.",learning:"I learnt that teamwork makes difficult things feel possible.",doBetter:"I would communicate earlier instead of keeping quiet.",strength:"teamwork",feedback:"My friend said I stayed calm under pressure.",selfPerception:"I now know I can contribute even when I am unsure.",commitmentArea:"School",commitment:"I will encourage classmates who are struggling.",iAm:"patient and supportive",iCan:"listen and communicate clearly",iHave:"friends and teachers who guide me",nextAction:"Check in on one classmate this week",status:"approved",favourite:true},
    {id:"2",name:"Ryan",className:"3G3",momentType:"Low moment",experience:"I found the high elements scary and wanted to stop.",feelings:"Afraid and embarrassed, but later determined.",learning:"I learnt that courage is taking one small step even when I am afraid.",doBetter:"I would focus on the next step and ask for help.",strength:"courage",feedback:"My instructor said I was more resilient than I thought.",selfPerception:"I realise I do not give up as easily as I believed.",commitmentArea:"Family",commitment:"I will be more patient when helping at home.",iAm:"learning from failure",iCan:"stay calm and break problems into steps",iHave:"support from my family",nextAction:"Help with one household task without being asked",status:"approved",favourite:false},
    {id:"3",name:"Danial",className:"3G2",momentType:"A mix of both",experience:"Our group got lost briefly during navigation but we worked together.",feelings:"Confused, worried and then excited.",learning:"I learnt to listen to different ideas before deciding.",doBetter:"I would check the map more carefully.",strength:"leadership",feedback:"My group said I helped everyone stay focused.",selfPerception:"I can lead without needing to control everything.",commitmentArea:"Community or Environment",commitment:"I will take more responsibility for shared spaces.",iAm:"responsible",iCan:"plan and organise tasks",iHave:"friends who will join me",nextAction:"Help keep the classroom clean after lessons",status:"approved",favourite:false},
    {id:"4",name:"Mei Lin",className:"3G2",momentType:"High moment",experience:"I helped a teammate finish a difficult climbing activity.",feelings:"Proud, grateful and connected.",learning:"I learnt that encouraging words can make a big difference.",doBetter:"I would notice earlier when someone needs support.",strength:"empathy",feedback:"My teammate said I made her feel safe.",selfPerception:"I see myself as someone who can support others.",commitmentArea:"School",commitment:"I will include classmates who are often quiet.",iAm:"caring and observant",iCan:"encourage others respectfully",iHave:"supportive classmates",nextAction:"Invite someone new into my group",status:"approved",favourite:true},
    {id:"5",name:"Siti",className:"3G1",momentType:"Low moment",experience:"I felt tired during the trek and almost gave up.",feelings:"Exhausted, frustrated and eventually accomplished.",learning:"I learnt to pace myself and accept help.",doBetter:"I would prepare mentally and physically earlier.",strength:"perseverance",feedback:"My instructor said I kept trying even when tired.",selfPerception:"I am stronger than I expected.",commitmentArea:"Family",commitment:"I will be more consistent in helping my younger sibling.",iAm:"determined",iCan:"manage my time better",iHave:"encouragement from my family",nextAction:"Plan a study routine with my sibling",status:"approved",favourite:false}
  ];

  const STOP = new Set("a an the and or but if to of in on for with from my our your i me we us is are was were be been being it this that these those as at by about into through during after before then than very more most some any one two can will would should could have has had do did does what how when where why who which also just really because so not".split(" "));
  let responses = [];
  let moderationFilter = "all";
  let presentMode = "random";

  const questionMap = {
    experience:"What was your most memorable OBS moment?",
    feelings:"How did the experience make you feel?",
    learning:"What did you learn from your OBS experience?",
    doBetter:"What would you do differently next time?",
    strength:"What strength did you discover?",
    selfPerception:"How has your view of yourself changed?",
    commitment:"What commitment will you make after OBS?",
    iAm:"I Am...",
    iCan:"I Can...",
    iHave:"I Have...",
    nextAction:"What is one action you will take this week?"
  };

  const $ = id => document.getElementById(id);
  const escapeHtml = (s="") => String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));

  async function loadResponses() {
    const url = window.OBS_CONFIG?.APPS_SCRIPT_URL?.trim();
    try {
      if (url) {
        const res = await fetch(`${url}?action=list`);
        const result = await res.json();
        responses = result.data || [];
        $("connectionText").textContent = "Connected to Google Sheet";
        $("connectionDot").style.background = "#69bd7c";
      } else {
        const local = JSON.parse(localStorage.getItem("obsAfterglowResponses") || "[]");
        responses = local.length ? local : DEMO;
        $("connectionText").textContent = local.length ? "Local responses" : "Demo data";
      }
      populateClasses();
      renderAll();
    } catch (e) {
      responses = DEMO;
      $("connectionText").textContent = "Demo data • connection unavailable";
      renderAll();
    }
  }

  function filtered() {
    const cls = $("classFilter").value;
    return responses.filter(r => !cls || r.className === cls);
  }

  function approved() {
    return filtered().filter(r => (r.status || "approved") === "approved");
  }

  function populateClasses() {
    const current = $("classFilter").value;
    const classes = [...new Set(responses.map(r => r.className).filter(Boolean))].sort();
    $("classFilter").innerHTML = `<option value="">All classes</option>` + classes.map(c=>`<option ${c===current?"selected":""}>${escapeHtml(c)}</option>`).join("");
  }

  function renderAll() {
    const data = filtered();
    $("totalResponses").textContent = data.length;
    $("highCount").textContent = data.filter(r=>r.momentType==="High moment").length;
    $("lowCount").textContent = data.filter(r=>r.momentType==="Low moment").length;
    $("topStrength").textContent = topWords(data.map(r=>r.strength).join(" "),1)[0]?.word || "—";
    renderCommitmentChart(data);
    renderDonut(data);
    renderWordCloud($("wordCloud"), data.map(r=>r[$("cloudQuestion").value]).join(" "));
    renderTable();
  }

  function renderCommitmentChart(data) {
    const areas = ["Family","School","Community or Environment"];
    const max = Math.max(1,...areas.map(a=>data.filter(r=>r.commitmentArea===a).length));
    $("commitmentChart").innerHTML = areas.map(a=>{
      const n = data.filter(r=>r.commitmentArea===a).length;
      return `<div class="bar-row"><b>${escapeHtml(a)}</b><div class="bar-track"><div class="bar-fill" style="width:${n/max*100}%"></div></div><strong>${n}</strong></div>`;
    }).join("");
  }

  function renderDonut(data) {
    const counts = [
      ["High", data.filter(r=>r.momentType==="High moment").length, "#6bb58d"],
      ["Low", data.filter(r=>r.momentType==="Low moment").length, "#ef9b63"],
      ["Mixed", data.filter(r=>r.momentType==="A mix of both").length, "#91c7d8"]
    ];
    const total = Math.max(1, counts.reduce((s,x)=>s+x[1],0));
    let acc = 0;
    const stops = counts.map(([_,n,c])=>{const start=acc;acc+=n/total*100;return `${c} ${start}% ${acc}%`}).join(",");
    $("momentDonut").style.background = `conic-gradient(${stops})`;
    $("donutValue").textContent = data.length;
    $("momentLegend").innerHTML = counts.map(([label,n,c])=>`<div class="legend-item"><span class="legend-dot" style="background:${c}"></span>${label}: <b>${n}</b></div>`).join("");
  }

  function topWords(text, limit=45) {
    const words = String(text).toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [];
    const counts = {};
    words.forEach(w=>{w=w.replace(/^'|'$/g,""); if(!STOP.has(w)) counts[w]=(counts[w]||0)+1});
    return Object.entries(counts).map(([word,count])=>({word,count})).sort((a,b)=>b.count-a.count).slice(0,limit);
  }

  function renderWordCloud(target, text) {
    const words = topWords(text);
    if (!words.length) return target.innerHTML = "<p>No responses yet.</p>";
    const max = words[0].count, min = words[words.length-1].count;
    target.innerHTML = words.map((w,i)=>{
      const size = 18 + ((w.count-min)/(Math.max(1,max-min))) * 42;
      const opacity = .58 + (w.count/max)*.42;
      const rot = [-4,0,0,0,4][i%5];
      return `<span class="cloud-word" style="font-size:${size}px;opacity:${opacity};transform:rotate(${rot}deg)">${escapeHtml(w.word)}</span>`;
    }).join("");
  }

  function renderTable() {
    const data = filtered().filter(r=>{
      if(moderationFilter==="all") return true;
      if(moderationFilter==="favourite") return !!r.favourite;
      return (r.status||"approved")===moderationFilter;
    });
    $("responseRows").innerHTML = data.map(r=>`
      <tr>
        <td><b>${escapeHtml(r.name||"—")}</b></td>
        <td>${escapeHtml(r.className||"—")}</td>
        <td>${escapeHtml(r.strength||"—")}</td>
        <td>${escapeHtml((r.commitment||"—").slice(0,90))}</td>
        <td><span class="status-tag ${r.favourite?"favourite":(r.status||"approved")}">${r.favourite?"★ Favourite":escapeHtml(r.status||"approved")}</span></td>
        <td><div class="table-actions">
          <button title="Approve" data-action="approve" data-id="${r.id}">✓</button>
          <button title="Hide" data-action="hide" data-id="${r.id}">⌁</button>
          <button title="Favourite" data-action="favourite" data-id="${r.id}">★</button>
        </div></td>
      </tr>`).join("") || `<tr><td colspan="6">No responses found.</td></tr>`;
  }

  async function updateResponse(id, changes) {
    const r = responses.find(x=>String(x.id)===String(id));
    if (!r) return;
    Object.assign(r, changes);
    const url = window.OBS_CONFIG?.APPS_SCRIPT_URL?.trim();
    if (url) {
      await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"moderate",id,...changes})});
    } else {
      localStorage.setItem("obsAfterglowResponses",JSON.stringify(responses));
    }
    renderAll();
  }

  function preparePresentation() {
    $("presentationQuestion").innerHTML = Object.entries(questionMap).map(([k,v])=>`<option value="${k}">${escapeHtml(v)}</option>`).join("");
    updatePresentQuestion();
    $("presentation").classList.remove("hidden");
    document.documentElement.requestFullscreen?.().catch(()=>{});
  }

  function updatePresentQuestion() {
    const key = $("presentationQuestion").value || "learning";
    $("presentQuestionText").textContent = questionMap[key];
    $("presentCategory").textContent = key.toUpperCase();
    $("randomAnswer").textContent = "Press “Reveal a Reflection” to share an anonymous response.";
    $("answerLabel").textContent = "Anonymous reflection";
    renderWall(key);
    renderWordCloud($("presentationCloud"), approved().map(r=>r[key]).join(" "));
  }

  function revealRandom() {
    const key = $("presentationQuestion").value;
    const pool = approved().filter(r=>r[key]?.trim());
    if (!pool.length) return $("randomAnswer").textContent = "No approved responses are available for this question.";
    const r = pool[Math.floor(Math.random()*pool.length)];
    $("randomAnswer").animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"none"}],{duration:320});
    $("randomAnswer").textContent = r[key];
    $("answerLabel").textContent = `Anonymous reflection • ${r.className || "Class"}`;
  }

  function renderWall(key) {
    const pool = approved().filter(r=>r[key]?.trim()).sort(()=>Math.random()-.5).slice(0,12);
    const colors = ["#ffe6b7","#dff0d4","#d7ecf5","#f6d7dc","#efe1ff"];
    $("stickyWall").innerHTML = pool.map((r,i)=>`<article class="sticky" style="background:${colors[i%colors.length]};--rot:${[-2,1,-1,2][i%4]}deg">${escapeHtml(r[key])}</article>`).join("") || "<p>No approved responses yet.</p>";
  }

  function setPresentMode(mode) {
    presentMode = mode;
    ["random","wall","cloud"].forEach(m=>{
      $(`${m}View`).classList.toggle("active",m===mode);
      $(`${m}Btn`).classList.toggle("active",m===mode);
    });
    updatePresentQuestion();
  }

  $("refreshBtn").addEventListener("click",loadResponses);
  $("classFilter").addEventListener("change",renderAll);
  $("cloudQuestion").addEventListener("change",renderAll);
  document.querySelector(".segmented").addEventListener("click",e=>{
    if(!e.target.dataset.filter)return;
    document.querySelectorAll(".segmented button").forEach(b=>b.classList.remove("active"));
    e.target.classList.add("active");
    moderationFilter=e.target.dataset.filter;renderTable();
  });
  $("responseRows").addEventListener("click",e=>{
    const btn=e.target.closest("button[data-action]"); if(!btn)return;
    const id=btn.dataset.id;
    if(btn.dataset.action==="approve") updateResponse(id,{status:"approved"});
    if(btn.dataset.action==="hide") updateResponse(id,{status:"hidden"});
    if(btn.dataset.action==="favourite") {
      const r=responses.find(x=>String(x.id)===String(id)); updateResponse(id,{favourite:!r.favourite});
    }
  });
  $("presentBtn").addEventListener("click",preparePresentation);
  $("closePresentBtn").addEventListener("click",()=>{ $("presentation").classList.add("hidden"); document.exitFullscreen?.(); });
  $("presentationQuestion").addEventListener("change",updatePresentQuestion);
  $("revealBtn").addEventListener("click",revealRandom);
  $("randomBtn").addEventListener("click",()=>setPresentMode("random"));
  $("wallBtn").addEventListener("click",()=>setPresentMode("wall"));
  $("cloudBtn").addEventListener("click",()=>setPresentMode("cloud"));

  loadResponses();
})();