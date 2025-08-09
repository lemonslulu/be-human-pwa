(()=>{
  const LIFE_YEARS = 78.4;      // fixed per user (US average)
  const PER_DAY = 1;            // assume the recorded session repeats once per day

  const btn = document.getElementById('actionBtn');
  const timerEl = document.getElementById('liveTimer');
  const projEl = document.getElementById('projection');

  let isRunning = false;
  let startTime = null;
  let elapsedMs = 0;
  let tick;

  const pad = (n)=> String(n).padStart(2,'0');
  const fmt = (ms)=>{
    const s = Math.floor(ms/1000);
    const h = Math.floor(s/3600);
    const m = Math.floor((s%3600)/60);
    const sec = s%60;
    return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  };

  function projectionText(ms){
    const totalMs = ms * PER_DAY * LIFE_YEARS * 365.25;
    const MSY = 31557600000; // 365.25 days
    const years = totalMs / MSY;
    const whole = Math.floor(years);
    const days = Math.round((years - whole) * 365.25);
    const approx = years >= 1 ? (years >= 10 ? years.toFixed(1) : years.toFixed(2)) : years.toFixed(3);
    return `At this pace, over a ${LIFE_YEARS}-year life, you'd spend about ${approx} years of it on a screen.
That’s roughly ${whole} years and ${days} days.
(Assuming you repeat this session once per day.)`;
  }

  function start(){
    isRunning = true;
    startTime = Date.now();
    elapsedMs = 0;
    btn.textContent = 'End';
    tick = setInterval(()=>{
      if(isRunning && startTime!=null){
        elapsedMs = Date.now() - startTime;
        timerEl.textContent = fmt(elapsedMs);
      }
    }, 200);
    navigator.vibrate?.(20);
  }

  function stop(){
    if(startTime==null) return;
    isRunning = false;
    clearInterval(tick);
    elapsedMs = Date.now() - startTime;
    timerEl.textContent = fmt(elapsedMs);
    btn.textContent = 'Be Human';
    projEl.textContent = projectionText(elapsedMs);
    navigator.vibrate?.([10,40,20]);
  }

  btn.addEventListener('click', ()=>{
    if(!isRunning) start(); else stop();
  });

  // Initial render
  timerEl.textContent = '00:00:00';

  // PWA: service worker register
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('service-worker.js').catch(console.error);
    });
  }
})();