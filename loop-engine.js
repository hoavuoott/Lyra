(function(root){
  function range(start,end,duration){start=Math.max(0,start);end=Math.min(duration,end);return Number.isFinite(start)&&Number.isFinite(end)&&end-start>.01?{start,end}:null}
  function wrap(time,r){const length=r.end-r.start;return time<r.start?r.start:r.start+((time-r.start)%length+length)%length}
  const api={range,wrap};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraLoop=api;
})(typeof globalThis==='undefined'?this:globalThis);
