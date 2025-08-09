(()=>{
  const LIFE_YEARS = 78.4;  // fixed
  const PER_DAY = 1;        // fixed
  const MS_PER_DAY = 86400000;

  const btn = document.getElementById('actionBtn');
  const timerEl = document.getElementById('liveTimer');
  const projEl = document.getElementById('projection');

  const installBtn = document.getElementById('installBtn');
  const modal = document.getElementById('installModal');
  const closeModal = document.getElementById('closeModal');
  const iosSteps = document.getElementById('iosSteps');
  const pwaSteps = document.getElementById('pwaSteps');
  const installConfirm = document.getElementById('installConfirm');

  let isRunning = false;
  let startTime = null;
  let elapsedMs = 0;
  let tick;
  let deferredPrompt = null; // Chrome/Android beforeinstallprompt

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  const pad = (n)=> String(n).padStart(2,'0');
  const fmt = (ms)=>{
    const s = Math.floor(ms/1000);
    const h = Math.floor(s/3600);
    const m = Math.floor((s%3600)/60);
    const sec = s%60;
    return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  };

  function projectionDays(ms){
    const totalMs = ms * PER_DAY * LIFE_YEARS * 365.25; // ms-per-day * life days
    const days = totalMs / MS_PER_DAY;
    const rounded = days >= 10 ? days.toFixed(1) : days.toFixed(2);
    return `At this pace, over ${LIFE_YEARS} years, you'd spend about ${rounded} days of your life on a screen.`;
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
    const text = projectionDays(elapsedMs) + '\n(Assuming you repeat this session once per day.)';
    projEl.innerText = text;
    navigator.vibrate?.([10,40,20]);
  }

  btn.addEventListener('click', ()=>{
    if(!isRunning) start(); else stop();
  });

  // Install flow
  function isiOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }
  function showModal(){
    modal.hidden = false;
    if (deferredPrompt && !isiOS()) {
      pwaSteps.classList.remove('hidden');
      iosSteps.classList.add('hidden');
    } else {
      pwaSteps.classList.add('hidden');
      iosSteps.classList.remove('hidden');
    }
  }
  function hideModal(){ modal.hidden = true; }

  installBtn.addEventListener('click', showModal);
  closeModal.addEventListener('click', hideModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) hideModal(); });

  if (installConfirm) {
    installConfirm.addEventListener('click', async ()=>{
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      hideModal();
    });
  }

  // PWA: service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('service-worker.js').catch(console.error);
    });
  }
})();