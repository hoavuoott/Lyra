(function(){
  let scope='all';
  function current(){return scope==='cue'?LyraLayout.config(state.layout,state.lines[selected].layout,state.size):LyraLayout.config(state.layout,{},state.size)}
  function paint(){const c=current();$('layoutscope').value=scope;$('layoutcue').textContent=scope==='cue'?'Ô '+String(selected+1).padStart(2,'0')+' · '+state.lines[selected].text:'Áp dụng cho toàn bộ lời (các ô có thiết lập riêng giữ nguyên)';for(const [id,key] of [['layoutmode','mode'],['layoutsizes','sizeMode'],['layoutcolumns','columns'],['layoutalign','align'],['layoutseed','seed']])$(id).value=c[key];$('textbasesize').value=c.size;$('textbasesizevalue').textContent=c.size+' px';$('layoutspread').value=Math.round(c.spread*100);$('layoutspreadvalue').textContent=Math.round(c.spread*100)+'%';$('layoutgap').value=Math.round(c.gap*100);$('layoutgapvalue').textContent=c.gap.toFixed(2)+' em';$('layoutalign').disabled=c.mode==='preset';$('layoutgap').disabled=c.mode==='preset';$('layoutkeeporder').checked=c.keepOrder;$('layoutspreadfield').hidden=c.sizeMode!=='random';$('layoutgridfield').hidden=!['grid','random'].includes(c.mode);$('layoutrandomfields').hidden=c.mode!=='random'&&c.sizeMode!=='random'}
  function update(patch){const c={...current(),...patch};if(scope==='all'){state.layout=c;state.size=c.size}else state.lines[selected].layout=c;render()}
  $('layoutscope').onchange=e=>{scope=e.target.value;paint()};
  for(const [id,key] of [['layoutmode','mode'],['layoutsizes','sizeMode'],['layoutalign','align']])$(id).onchange=e=>update({[key]:e.target.value});
  $('layoutcolumns').onchange=e=>update({columns:Number(e.target.value)});$('textbasesize').oninput=e=>update({size:Number(e.target.value)});$('layoutspread').oninput=e=>update({spread:Number(e.target.value)/100});$('layoutgap').oninput=e=>update({gap:Number(e.target.value)/100});$('layoutkeeporder').onchange=e=>update({keepOrder:e.target.checked});$('layoutseed').onchange=e=>update({seed:Number(e.target.value)||17});
  $('shufflelayout').onclick=()=>update({seed:(current().seed+7919)%1000000||17});
  $('resetlayout').onclick=()=>{if(scope==='all'){delete state.layout;state.size=64}else delete state.lines[selected].layout;render()};
  $('synclayout').onclick=()=>{state.layout=current();state.size=state.layout.size;state.lines.forEach(line=>delete line.layout);scope='all';render();status('Đã áp dụng đồng bộ cỡ chữ và bố cục cho mọi ô lời.')};
  const before=property;property=function(){before();paint()};paint();
})();
