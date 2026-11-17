// Add each real deployed project URL in the live field below.
const projects = [
  {title:"Weather App", icon:"weather", c:["#0F766E","#38BDF8"], tags:["HTML","CSS","JavaScript"],
   short:"Check the weather for any city.",
   desc:"A responsive weather app where you search for a city and see its current conditions and forecast.",
   live:"https://asfia18.github.io/skypulse_weather_Datheon_Full_Stack_Web_Development_Internship/"},
  {title:"Pakistan Jobs Website", icon:"jobs", c:["#1F4FD8","#6E93FF"], tags:["HTML","CSS","JavaScript"],
   short:"A job listing website for Pakistan.",
   desc:"A website where visitors can browse job listings across Pakistan, with a clean and responsive layout.",
   live:"https://asfia18.github.io/Pakistan-Jobs/"}
];

const projectIcons = {
  weather: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18Z"/><path d="M12 2v2M4.9 4.9l1.4 1.4M19.1 4.9l-1.4 1.4"/></svg>',
  jobs: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>'
};

const $ = s => document.querySelector(s), grid = $("#grid"), modal = $("#modal");
projects.forEach((p, i) => {
  const b = document.createElement("button");
  b.className = "card";
  b.style.setProperty("--c1", p.c[0]); b.style.setProperty("--c2", p.c[1]);
  b.innerHTML = `<div class="thumb" aria-hidden="true"><span class="project-mark">${projectIcons[p.icon] || ""}</span></div>
    <div class="in"><h3>${p.title}</h3><p>${p.short}</p><ul class="tags">${p.tags.map(t => `<li class="chip">${t}</li>`).join("")}</ul><span class="project-actions"><span class="project-action">Explore Project <span class="arrow" aria-hidden="true">→</span></span></span></div>`;
  b.addEventListener("click", () => {
    modal.style.setProperty("--c1", p.c[0]); modal.style.setProperty("--c2", p.c[1]);
    $("#m-title").textContent = p.title; $("#m-desc").textContent = p.desc;
    $("#m-tags").innerHTML = p.tags.map(t => `<li class="chip">${t}</li>`).join("");
    const liveButton = $("#m-live"), liveNote = $("#m-live-note");
    const hasLiveLink = Boolean(p.live && p.live !== "#");
    liveButton.href = hasLiveLink ? p.live : "#";
    liveButton.hidden = !hasLiveLink;
    liveNote.hidden = hasLiveLink;
    // Open the project details dialog reliably in supported browsers.
    if (typeof modal.showModal === "function") {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  });
  grid.appendChild(b);
});
$("#close").addEventListener("click", () => {
  if (typeof modal.close === "function") modal.close();
  else modal.removeAttribute("open");
});
modal.addEventListener("click", e => {
  if (e.target === modal) {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }
});

// Mobile menu
const menu = $("#menu"), nav = $("#nav");
const closeMenu = () => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", false); menu.textContent = "☰"; };
menu.addEventListener("click", () => { const o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", o); menu.textContent = o ? "✕" : "☰"; });
nav.addEventListener("click", e => { if (e.target.tagName === "A") closeMenu(); });

// Theme + accent, remembered between visits
const root = document.documentElement;
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e) { return null; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch(e) {} }
};
function setTheme(t){
  root.dataset.theme = t;
  document.querySelectorAll(".theme-btn").forEach(b => {
    b.textContent = t === "dark" ? "☼" : "◐";
    b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  });
}
function setAccent(a){
  root.dataset.accent = a;
  document.querySelectorAll(".dot").forEach(d => d.setAttribute("aria-pressed", d.dataset.a === a));
}
setTheme(store.get("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
setAccent(store.get("accent") || "teal");
document.querySelectorAll(".theme-btn").forEach(b => b.addEventListener("click", () => {
  const t = root.dataset.theme === "dark" ? "light" : "dark"; setTheme(t); store.set("theme", t);
}));
document.querySelectorAll(".dot").forEach(d => d.addEventListener("click", () => { setAccent(d.dataset.a); store.set("accent", d.dataset.a); }));

// Highlight current section in nav
const links = [...document.querySelectorAll("nav a")];
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
}), {rootMargin:"-40% 0px -55% 0px"});
document.querySelectorAll("section[id]").forEach(s => io.observe(s));

// Contact form opens the visitor's email app (works on static hosting)
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get("msg")}\n\nFrom: ${f.get("name")} (${f.get("email")})`;
  location.href = `mailto:asfiaansari18@gmail.com?subject=${encodeURIComponent("Portfolio message from " + f.get("name"))}&body=${encodeURIComponent(body)}`;
});
// Animated starfield; light mode reveals a glowing moon after a short delay
const starCanvas = document.getElementById("starfield");
const ctx = starCanvas.getContext("2d");
let stars = [], shooters = [], raf, lightModeSince = Date.now();
function resizeStars(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  starCanvas.width = innerWidth * dpr; starCanvas.height = innerHeight * dpr;
  starCanvas.style.width = innerWidth + "px"; starCanvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars = Array.from({length: Math.min(190, Math.floor(innerWidth*innerHeight/6500))}, () => ({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.8+.35,
    a:Math.random()*.7+.25,phase:Math.random()*6
  }));
}
function drawMoon(opacity){
  if(opacity<=0) return;
  const x=innerWidth*.84, y=Math.max(82,innerHeight*.13), r=Math.min(30,innerWidth*.035);
  const halo=ctx.createRadialGradient(x,y,r*.2,x,y,r*3.5);
  halo.addColorStop(0,`rgba(126,164,255,${opacity*.24})`); halo.addColorStop(1,'rgba(126,164,255,0)');
  ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,r*3.5,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.globalAlpha=opacity;
  const moon=ctx.createRadialGradient(x-r*.35,y-r*.4,2,x,y,r);
  moon.addColorStop(0,'#ffffff');moon.addColorStop(.65,'#eaf1ff');moon.addColorStop(1,'#b8ccf6');
  ctx.shadowColor='rgba(103,143,230,.55)';ctx.shadowBlur=24;ctx.fillStyle=moon;
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  // Crescent shadow gives the moon a polished, dreamy look
  ctx.shadowBlur=0;ctx.fillStyle='#f3f7ff';ctx.beginPath();ctx.arc(x+r*.38,y-r*.22,r*.82,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function drawStars(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  const dark = root.dataset.theme === "dark";
  if(root.dataset.theme === 'light') lightModeSince=lightModeSince||Date.now(); else lightModeSince=Date.now();
  const elapsed=Date.now()-lightModeSince;
  const reveal=dark?1:Math.max(0,Math.min(1,(elapsed-3500)/1200));
  stars.forEach(st => {
    const twinkle=.55+Math.sin(Date.now()/550+st.phase)*.42;
    ctx.beginPath();ctx.arc(st.x,st.y,st.r*(1+(twinkle*.25)),0,Math.PI*2);
    if(dark){ctx.fillStyle=`rgba(220,237,255,${st.a*twinkle})`;ctx.shadowColor='#9dcaff';ctx.shadowBlur=st.r*4;}
    else {ctx.fillStyle=`rgba(73,105,177,${st.a*twinkle*(.18+reveal*.82)})`;ctx.shadowColor='#7fa8ff';ctx.shadowBlur=st.r*(2+reveal*5);}
    ctx.fill();ctx.shadowBlur=0;
  });
  if(!dark) drawMoon(reveal);
  const chance=dark?.025:(reveal>.2?.035:.008);
  if(Math.random()<chance && shooters.length<2) shooters.push({x:Math.random()*innerWidth*.8+innerWidth*.05,y:Math.random()*innerHeight*.38,v:7+Math.random()*5,life:0});
  shooters=shooters.filter(sh=>sh.life<34);
  shooters.forEach(sh=>{
    const alpha=1-sh.life/34;
    ctx.save();ctx.lineCap='round';ctx.lineWidth=dark?2:2.2;
    ctx.strokeStyle=dark?`rgba(206,231,255,${alpha})`:`rgba(73,119,218,${alpha*(.15+reveal*.85)})`;
    ctx.shadowColor=dark?'#b9dcff':'#8eb4ff';ctx.shadowBlur=dark?12:16;
    ctx.beginPath();ctx.moveTo(sh.x,sh.y);ctx.lineTo(sh.x-sh.v*7,sh.y-sh.v*3.5);ctx.stroke();ctx.restore();
    sh.x+=sh.v;sh.y+=sh.v*.5;sh.life++;
  });
  raf=requestAnimationFrame(drawStars);
}
// Restart the light-mode reveal whenever the visitor switches themes.
const originalSetTheme=setTheme;
setTheme=function(t){ originalSetTheme(t); lightModeSince=Date.now(); };
resizeStars();drawStars();
window.addEventListener("resize",resizeStars);
