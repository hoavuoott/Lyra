(function(root){
  function name(value){return typeof value==='string'?value.trim().slice(0,100)||'Untitled session':'Untitled session'}
  function filename(value,extension){const title=name(value),base=title==='Untitled session'?'lyra-project':title.replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').replace(/[. ]+$/g,'').slice(0,80)||'lyra-project';return base+'.'+extension}
  function decoration(state){const c=state.decoration||{},old=!!state.background?.decor,corners=c.corners||{},text={};for(const key of ['tl','tr','bl','br'])text[key]=typeof corners[key]==='string'?corners[key].slice(0,160):'';return {grid:c.grid??old,orbit:c.orbit??old,corners:text,color:/^#[0-9a-f]{6}$/i.test(c.color||'')?c.color:'#808080',size:Math.max(10,Math.min(40,Number(c.size)||16)),inset:Math.max(1,Math.min(12,Number(c.inset)||4))}}
  const api={name,filename,decoration};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraProject=api;
})(typeof globalThis==='undefined'?this:globalThis);
