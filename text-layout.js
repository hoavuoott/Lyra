(function(root){
  const defaults={mode:'preset',sizeMode:'preset',size:null,spread:.35,gap:.25,columns:2,align:'center',seed:17,keepOrder:true};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function config(global={},local={},fallback=64){const value={...defaults,...global,...local};return {...value,mode:['preset','flow','stack','grid','stairs','random'].includes(value.mode)?value.mode:'preset',sizeMode:['preset','uniform','random'].includes(value.sizeMode)?value.sizeMode:'preset',size:clamp(Number(value.size)||fallback,12,200),spread:clamp(Number(value.spread)||0,0,.75),gap:clamp(Number(value.gap)||0,.05,1),columns:clamp(Math.round(Number(value.columns)||2),1,4),align:['left','center','right'].includes(value.align)?value.align:'center',seed:(Number(value.seed)||17)>>>0,keepOrder:true}}
  function random(seed){let n=seed>>>0;return ()=>{n+=0x6d2b79f5;let t=n;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
  function hash(text){let n=2166136261;for(const char of String(text)){n^=char.codePointAt(0);n=Math.imul(n,16777619)}return n>>>0}
  function plan(count,settings={},text=''){const c=config(settings),rng=random(c.seed^hash(text)),positions=Array.from({length:count},(_,i)=>i);return Array.from({length:count},(_,index)=>({index,order:positions[index],scale:c.sizeMode==='random'?1+(rng()*2-1)*c.spread:1,rotate:c.mode==='random'?(rng()*2-1)*7:0,x:c.mode==='random'?(rng()*2-1)*.08:0,y:c.mode==='stairs'?(index%4)*.18:0,align:c.mode==='random'?['start','center','end'][Math.floor(rng()*3)]:'center'}))}
  function apply(container,nodes,settings,text){const c=config(settings),items=plan(nodes.length,c,text);if(c.mode!=='preset'){container.classList.add('manual-layout','arrange-'+c.mode);for(const node of nodes)container.append(node);for(const row of container.querySelectorAll('.type-row'))row.remove();container.style.setProperty('--layout-columns',c.columns);container.style.setProperty('--layout-gap',c.gap+'em');container.style.setProperty('--layout-align',c.align==='left'?'flex-start':c.align==='right'?'flex-end':'center')}
    nodes.forEach((node,index)=>{const item=items[index];node.classList.add('layout-word');if(c.sizeMode!=='preset')node.style.setProperty('font-size',item.scale.toFixed(4)+'em','important');if(c.mode==='random'){node.style.order=item.order;node.style.rotate=item.rotate.toFixed(3)+'deg';node.style.translate=item.x.toFixed(3)+'em 0';node.style.alignSelf=item.align;node.style.justifySelf=item.align}if(c.mode==='stairs')node.style.translate='0 '+item.y.toFixed(3)+'em';});return c}
  function fits(container,nodes,settings,height){
    if(container.scrollWidth>container.clientWidth+2||container.scrollHeight>height*.76)return false;
    const c=config(settings),css=getComputedStyle(container),padding=(parseFloat(css.paddingLeft)||0)+(parseFloat(css.paddingRight)||0),gap=parseFloat(css.columnGap)||0;
    const width=container.clientWidth-padding,slot=['grid','random'].includes(c.mode)?(width-gap*(c.columns-1))/c.columns:width;
    return nodes.every(node=>Math.max(node.offsetWidth,node.scrollWidth)<=slot+1);
  }
  const api={defaults,config,plan,apply,fits};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraLayout=api;
})(typeof globalThis==='undefined'?this:globalThis);
