(function(root){
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function edit(items,mode,delta,global=0){let low=-Infinity,high=Infinity;for(const l of items){const origin=l.start+((l.offset||0)+global)/1000;if(mode!=='end')low=Math.max(low,-origin);if(mode==='start')high=Math.min(high,l.end-l.start-.08);if(mode==='end')low=Math.max(low,l.start+.08-l.end)}delta=clamp(delta,low,high);return items.map(l=>({...l,start:l.start+(mode==='end'?0:delta),end:l.end+(mode==='start'?0:delta)}))}
 function hits(box,rect){return box.right>=rect.left&&box.left<=rect.right&&box.bottom>=rect.top&&box.top<=rect.bottom}
 const api={edit,hits};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraSelection=api;
})(typeof globalThis==='undefined'?this:globalThis);
