(() => {
  const brand=document.querySelector('.nav .brand');
  const bar=brand.querySelector('.logo-right-bottom');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let value=0,frame=0,hovered=false,focused=false;
  // The upper two cuts share this diagonal. Extend it into the bottom row.
  const slope=(196.41-220.47)/59.11;
  const topShift=220.47+slope*140.69-85.18;
  const bottomShift=220.47+slope*199.8-61.12;
  function draw(){bar.setAttribute('points',`${61.12+bottomShift*value} 199.8 373 199.8 373 140.69 ${85.18+topShift*value} 140.69`)}
  function animate(){
    cancelAnimationFrame(frame);
    if(motion.matches){value=0;draw();return}
    const from=value,target=hovered||focused?1:0,start=performance.now()+140;
    function tick(time){
      const t=Math.min(1,Math.max(0,(time-start)/450));
      const eased=1-Math.pow(1-t,3);
      value=from+(target-from)*eased;draw();
      if(t<1)frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
  }
  brand.addEventListener('pointerenter',()=>{hovered=true;animate()});
  brand.addEventListener('pointerleave',()=>{hovered=false;animate()});
  brand.addEventListener('focus',()=>{focused=true;animate()});
  brand.addEventListener('blur',()=>{focused=false;animate()});
  motion.addEventListener('change',animate);
})();
