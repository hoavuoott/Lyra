(function(root){
  const accented=['PlainTypography','GradientType','HighlightBar','LineReveal','SplitLines','TypeCursor','RevealGlow','DigitalGlitch','HandDrawn'];
  const valid=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
  function resolve(state,line={}){const p=line.palette||{};return {color:valid(p.color)?p.color:valid(state.color)?state.color:'#111111',accent:valid(p.accent)?p.accent:valid(state.motion?.accent)?state.motion.accent:'#d11173'}}
  const api={resolve,valid,accented};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraPalette=api;
})(typeof globalThis==='undefined'?this:globalThis);
