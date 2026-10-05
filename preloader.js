(() => {
  const root=document.documentElement,loader=document.querySelector('.preloader'),main=document.querySelector('main');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let finished=false,settled=0,fontReady=false;const started=performance.now();
  const counter=document.querySelector('.loader-count'),bar=document.querySelector('.loader-progress span');
  function finish(){if(finished)return;finished=true;root.classList.remove('is-loading');root.classList.add('page-ready');main.inert=false;if(settled>=72&&fontReady){counter.textContent='100%';bar.style.width='100%';}loader.classList.add('is-leaving');setTimeout(()=>loader.remove(),motion.matches?0:900)}
  function update(){if(finished)return;const percent=Math.round((Math.min(settled,72)+(fontReady?1:0))/73*100);counter.textContent=String(percent).padStart(2,'0')+'%';bar.style.width=percent+'%';if(settled>=72&&fontReady)setTimeout(finish,Math.max(0,3000-(performance.now()-started)))}
  window.portfolioFrameSettled=()=>{settled++;update()};
  document.querySelector('.loader-skip').addEventListener('click',finish);
  if(motion.matches||location.hash||window.scrollY>0){finish();return}
  root.classList.add('is-loading');main.inert=true;
  const fonts=document.fonts?Promise.all([document.fonts.load('800 16px "Outfit"'),document.fonts.load('400 16px "Portfolio Gothic"'),document.fonts.load('400 16px "Nimbus Sans"')]):Promise.resolve();
  fonts.catch(()=>{}).then(()=>{fontReady=true;update()});
  setTimeout(finish,6000);
})();
