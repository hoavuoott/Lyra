(function(root){
  function mount(view,slider,label,getDuration,options={}){
    let pan=null;const range=()=>Math.max(0,view.scrollWidth-view.clientWidth);
    function sync(){const max=range(),duration=getDuration();slider.disabled=max<1;slider.value=max?view.scrollLeft/max*1000:0;const start=duration*view.scrollLeft/Math.max(1,view.scrollWidth),end=duration*(view.scrollLeft+view.clientWidth)/Math.max(1,view.scrollWidth);label.textContent=start.toFixed(1)+' – '+Math.min(duration,end).toFixed(1)+' s';slider.setAttribute('aria-valuetext',label.textContent);}
    slider.addEventListener('input',()=>{view.scrollLeft=range()*Number(slider.value)/1000;sync()});
    view.addEventListener('scroll',sync,{passive:true});
    view.addEventListener('pointerdown',e=>{const blocked=e.target?.closest?.('.clip,[data-word],.assetclip,.clip-video'),surface=options.surface?.contains(e.target)||options.ruler?.contains(e.target),scrub=e.button===0&&surface&&!blocked;if(e.button!==1&&!scrub)return;e.preventDefault();e.stopPropagation();pan={x:e.clientX,left:view.scrollLeft,id:e.pointerId,scrub};view.setPointerCapture(e.pointerId);view.classList.add(scrub?'is-scrubbing':'is-panning');if(scrub){options.onScrubStart?.(e);(options.onScrub||options.onRulerClick)?.(e)}},true);
    view.addEventListener('pointermove',e=>{if(!pan||e.pointerId!==pan.id)return;e.preventDefault();if(pan.scrub){(options.onScrub||options.onRulerClick)?.(e);return}view.scrollLeft=Math.max(0,Math.min(range(),pan.left+pan.x-e.clientX));sync()});
    function finish(e){if(!pan||e.pointerId!==pan.id)return;const scrub=pan.scrub;pan=null;view.classList.remove('is-panning');view.classList.remove('is-scrubbing');if(view.hasPointerCapture(e.pointerId))view.releasePointerCapture(e.pointerId);if(scrub){if(e.type!=='pointercancel')(options.onScrub||options.onRulerClick)?.(e);options.onScrubEnd?.(e)}}
    view.addEventListener('pointerup',finish);view.addEventListener('pointercancel',finish);view.addEventListener('lostpointercapture',e=>{if(pan?.scrub)options.onScrubEnd?.(e);pan=null;view.classList.remove('is-panning');view.classList.remove('is-scrubbing')});
    for(const name of ['mousedown','auxclick'])view.addEventListener(name,e=>{if(e.button===1)e.preventDefault()});
    view.addEventListener('wheel',e=>{if(!e.shiftKey&&!e.deltaX)return;e.preventDefault();view.scrollLeft+=e.deltaX||e.deltaY;sync()},{passive:false});
    return {sync,step(direction){view.scrollLeft=Math.max(0,Math.min(range(),view.scrollLeft+direction*view.clientWidth*.65));sync()}};
  }
  const api={mount};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraTimeline=api;
})(typeof globalThis==='undefined'?this:globalThis);
