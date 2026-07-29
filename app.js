(() => {
  const form = document.getElementById("reflectionForm");
  const steps = [...document.querySelectorAll(".step")];
  const trailSteps = [...document.querySelectorAll(".trail-step")];
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const submitBtn = document.getElementById("submitBtn");
  const saveDraftBtn = document.getElementById("saveDraftBtn");
  const trailFill = document.getElementById("trailFill");
  const reviewPanel = document.getElementById("reviewPanel");
  const submitState = document.getElementById("submitState");
  let currentStep = 1;

  const labels = {
    name:"Name", className:"Class", groupName:"OBS group / watch",
    momentType:"Moment type", experience:"What happened", feelings:"How I felt",
    learning:"What I learnt", doBetter:"What I would do differently",
    strength:"Strength discovered", feedback:"Feedback received",
    selfPerception:"How I see myself now", commitmentArea:"Commitment area",
    commitment:"My commitment", iAm:"I Am", iCan:"I Can", iHave:"I Have",
    nextAction:"One action this week"
  };

  function setStep(step) {
    currentStep = Math.max(1, Math.min(5, step));
    steps.forEach(s => s.classList.toggle("active", Number(s.dataset.step) === currentStep));
    trailSteps.forEach(t => {
      const n = Number(t.dataset.step);
      t.classList.toggle("active", n === currentStep);
      t.classList.toggle("done", n < currentStep);
    });
    const pct = ((currentStep - 1) / 4) * 100;
    if (window.innerWidth <= 900) {
      trailFill.style.width = `${pct}%`;
      trailFill.style.height = "100%";
    } else {
      trailFill.style.height = `${pct}%`;
      trailFill.style.width = "100%";
    }
    prevBtn.disabled = currentStep === 1;
    nextBtn.classList.toggle("hidden", currentStep === 5);
    submitBtn.classList.toggle("hidden", currentStep !== 5);
    if (currentStep === 5) buildReview();
    window.scrollTo({top: document.querySelector(".reflection-card").offsetTop - 20, behavior:"smooth"});
  }

  function validateCurrentStep() {
    const fields = [...steps[currentStep - 1].querySelectorAll("input, textarea, select")];
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  function getData() {
    return Object.fromEntries(new FormData(form).entries());
  }

  function buildReview() {
    const data = getData();
    reviewPanel.innerHTML = Object.entries(labels)
      .filter(([key]) => data[key])
      .map(([key, label]) => `<div class="review-item"><small>${label}</small><p>${escapeHtml(data[key])}</p></div>`)
      .join("");
  }

  function escapeHtml(str="") {
    return str.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  }

  function saveDraft(showMessage=true) {
    localStorage.setItem("obsAfterglowDraft", JSON.stringify(getData()));
    if (showMessage) {
      const old = saveDraftBtn.textContent;
      saveDraftBtn.textContent = "Draft saved ✓";
      setTimeout(() => saveDraftBtn.textContent = old, 1400);
    }
  }

  function restoreDraft() {
    const raw = localStorage.getItem("obsAfterglowDraft");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([key, value]) => {
        const fields = form.querySelectorAll(`[name="${CSS.escape(key)}"]`);
        fields.forEach(field => {
          if (field.type === "radio" || field.type === "checkbox") field.checked = field.value === value;
          else field.value = value;
        });
      });
      updateCounters();
    } catch {}
  }

  function updateCounters() {
    document.querySelectorAll("textarea[maxlength]").forEach(el => {
      const counter = document.querySelector(`.counter[data-for="${el.name}"]`);
      if (counter) counter.textContent = `${el.value.length} / ${el.maxLength}`;
    });
  }

  nextBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    saveDraft(false);
    setStep(currentStep + 1);
  });
  prevBtn.addEventListener("click", () => setStep(currentStep - 1));
  trailSteps.forEach(btn => btn.addEventListener("click", () => {
    const target = Number(btn.dataset.step);
    if (target <= currentStep || validateCurrentStep()) setStep(target);
  }));
  saveDraftBtn.addEventListener("click", () => saveDraft(true));
  form.addEventListener("input", updateCounters);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    submitState.className = "submit-state";
    submitState.textContent = "";

    const payload = {
      action: "submit",
      timestamp: new Date().toISOString(),
      ...getData()
    };

    try {
      const url = window.OBS_CONFIG?.APPS_SCRIPT_URL?.trim();
      if (url) {
        const res = await fetch(url, {
          method:"POST",
          headers:{"Content-Type":"text/plain;charset=utf-8"},
          body:JSON.stringify(payload)
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message || "Submission failed");
      } else {
        const demo = JSON.parse(localStorage.getItem("obsAfterglowResponses") || "[]");
        demo.push({...payload, id: crypto.randomUUID(), status:"approved", favourite:false});
        localStorage.setItem("obsAfterglowResponses", JSON.stringify(demo));
      }
      localStorage.removeItem("obsAfterglowDraft");
      submitState.className = "submit-state success";
      submitState.innerHTML = "<strong>Reflection submitted.</strong><br>Your experience is now part of our class journey.";
      form.querySelectorAll("input, textarea").forEach(el => el.disabled = true);
      submitBtn.classList.add("hidden");
      prevBtn.classList.add("hidden");
    } catch (err) {
      submitState.className = "submit-state error";
      submitState.textContent = `Could not submit: ${err.message}`;
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Reflection ✓";
    }
  });

  window.addEventListener("resize", () => setStep(currentStep));
  restoreDraft();
  updateCounters();
  setStep(1);
})();