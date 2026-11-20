(function(root){
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function wordDrag(words,index,edge,delta,duration,linked=true){const result=words.map(w=>({...w})),w=result[index];if(!w)return result;const prev=result[index-1],next=result[index+1],epsilon=.02;
  const min=prev?(linked?prev.start+epsilon:prev.end):0,max=next?(linked?next.end-epsilon:next.start):duration;
  if(edge==='start')w.start=clamp(w.start+delta,min,w.end-epsilon);else if(edge==='end')w.end=clamp(w.end+delta,w.start+epsilon,max);else{delta=clamp(delta,min-w.start,max-w.end);w.start+=delta;w.end+=delta}
  if(linked){if(prev)prev.end=w.start;if(next)next.start=w.end}return result;
 }
 function clipEnd(c){return c.start+(c.outPoint-c.inPoint)/(c.rate||1)}
 function clipTime(c,time){return c.inPoint+(time-c.start)*(c.rate||1)}
 function trim(c,edge,delta){const n={...c},rate=c.rate||1;if(edge==='start'){delta=clamp(delta,Math.max(-c.start,-c.inPoint/rate),(c.outPoint-c.inPoint)/rate-.05);n.start+=delta;n.inPoint+=delta*rate}else if(edge==='end')n.outPoint=clamp(c.outPoint+delta*rate,c.inPoint+.05*rate,c.sourceDuration);else n.start=Math.max(0,c.start+delta);n.end=clipEnd(n);return n}
 function split(c,time,id){if(time<=c.start+.05||time>=clipEnd(c)-.05)return null;const cut=clipTime(c,time),left={...c,outPoint:cut,end:time},right={...c,id,start:time,inPoint:cut,end:clipEnd(c)};return [left,right]}
 const api={wordDrag,clipEnd,clipTime,trim,split};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraEdit=api;
})(typeof globalThis==='undefined'?this:globalThis);
