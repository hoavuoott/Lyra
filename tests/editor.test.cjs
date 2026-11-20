const test=require('node:test'),assert=require('node:assert/strict');
const cue=require('../cue-engine.js'),motion=require('../word-motion.js'),{mount}=require('../timeline-controls.js');
test('automatic word windows follow cue length; style edits do not freeze auto timing',()=>{
  const line={text:'Cho từng lời bay xa',start:2,end:7};cue.update(line,2,{glow:true,enlarge:true,scale:1.5});
  assert.equal(cue.words(line)[2].start,2);assert.equal(cue.words(line)[2].glow,true);line.end=12;assert.equal(cue.words(line)[2].start,4);
});
test('emphasis activates inside the specified word interval and clears on seek outside it',()=>{
  const line={text:'Cho từng lời',start:10,end:13,offset:500};cue.update(line,1,{start:.7,end:1.6,enlarge:true,scale:1.7,glow:true,underline:true});const word=cue.words(line)[1];
  assert.equal(cue.emphasis(word,.6).on,false);assert.equal(cue.emphasis(word,1).scale,1.7);assert.equal(cue.emphasis(word,1).glow,1);assert.equal(cue.emphasis(word,1).underline,1);assert.equal(cue.emphasis(word,1.6).on,false);assert.equal(cue.emphasis(word,2).scale,1);
  // Global and per-line delays shift the cue origin, leaving word-local timing intact.
  const origin=line.start+(line.offset+250)/1000;assert.equal(cue.emphasis(word,origin+1-origin).on,true);
});
test('editing lyrics invalidates mismatching word styles; manual bounds are clamped',()=>{
  const line={text:'Xin chào',start:0,end:2};cue.update(line,1,{glow:true,start:1,end:20});assert.equal(cue.words(line)[1].end,2);line.text='Xin hẹn';assert.equal(cue.words(line)[1].glow,false);assert.equal(cue.words(line)[1].manual,false);
});
test('enlarged words reserve space so scale does not cover neighboring words',()=>{const line={text:'Xin chào',start:0,end:2};cue.update(line,1,{enlarge:true,scale:1.5});const targets=[0,1].map(()=>({offsetWidth:100,style:{setProperty(k,v){this[k]=v}}}));cue.reserve(targets,line);assert.equal(targets[0].style['--word-reserve'],'0.00px');assert.equal(targets[1].style['--word-reserve'],'25.00px')});
test('new word styles follow word timing deterministically, including decode and backspace',()=>{
  for(const {id} of motion.presets)for(const span of [.04,.4,3])for(const time of [0,1,1.05,1+span/2,1+span,3.9]){const input={fx:id,start:1,end:1+span,duration:4,time,index:1,glyph:2,glyphCount:5,wordCount:3,intensity:1.8},f=motion.frame(input);assert.deepEqual(f,motion.frame(input));assert.ok(!/NaN|Infinity/.test(JSON.stringify(f)));assert.ok(f.opacity>=0&&f.opacity<=1);if(time<1)assert.equal(f.opacity,0)}
  assert.equal(motion.frame({fx:'WordPop',time:2,start:0,end:1}).opacity,0);
  assert.notEqual(motion.frame({fx:'WordDecode',time:.05,start:0,end:1}).text,null);assert.equal(motion.frame({fx:'WordDecode',time:.5,start:0,end:1}).text,null);
  assert.equal(motion.frame({fx:'WordType',time:3.99,start:1,end:2,duration:4,index:2,wordCount:3}).opacity,0);
});
class Control{constructor(){this.handlers={};this.scrollLeft=0;this.scrollWidth=2000;this.clientWidth=500;this.value=0;this.attrs={};this.classList={add(){},remove(){}}}addEventListener(name,fn){(this.handlers[name]??=[]).push(fn)}dispatch(name,event={}){for(const fn of this.handlers[name]||[])fn({type:name,...event})}setAttribute(k,v){this.attrs[k]=v}setPointerCapture(id){this.capture=id}hasPointerCapture(id){return this.capture===id}releasePointerCapture(){this.capture=null}}
function pointer(x,button=1){return {clientX:x,button,pointerId:1,preventDefault(){this.prevented=true},stopPropagation(){this.stopped=true}}}
test('scrollbar and middle-drag pan; holding left on the timeline scrubs continuously without panning',()=>{
  const view=new Control(),slider=new Control(),label={},surface={},target={};surface.contains=t=>t===target;let starts=0,ends=0,seeks=[];
  const nav=mount(view,slider,label,()=>20,{surface,onScrubStart:()=>starts++,onScrub:e=>seeks.push(e.clientX),onScrubEnd:()=>ends++});nav.sync();slider.value=500;slider.dispatch('input');assert.equal(view.scrollLeft,750);assert.equal(seeks.length,0);
  view.dispatch('pointerdown',pointer(300));view.dispatch('pointermove',pointer(200));view.dispatch('pointerup',pointer(200));assert.equal(view.scrollLeft,850);assert.equal(seeks.length,0);
  view.dispatch('pointerdown',{...pointer(300,0),target});view.dispatch('pointermove',{...pointer(250,0),target});view.dispatch('pointermove',{...pointer(200,0),target});view.dispatch('pointerup',{...pointer(200,0),target});assert.equal(view.scrollLeft,850);assert.deepEqual(seeks,[300,250,200,200]);assert.equal(starts,1);assert.equal(ends,1);
  view.dispatch('pointerdown',{...pointer(300,0),target});view.dispatch('pointercancel',pointer(300,0));assert.equal(starts,2);assert.equal(ends,2);
});
test('fit timeline disables the scrollbar and scrolling remains bounded',()=>{
  const view=new Control(),slider=new Control(),label={};view.scrollWidth=500;const nav=mount(view,slider,label,()=>20);nav.sync();assert.equal(slider.disabled,true);assert.equal(slider.value,0);nav.step(1);assert.equal(view.scrollLeft,0);
  view.scrollWidth=2000;nav.step(100);assert.equal(view.scrollLeft,1500);nav.step(-100);assert.equal(view.scrollLeft,0);
});
test('the three libraries expose 51 unique, backward-compatible preset ids',()=>{const old=require('../motion-engine.js').presets,type=require('../type-engine.js').presets;assert.equal(new Set([...old,...type,...motion.presets].map(p=>p.id)).size,51)});
test('automatic karaoke advances across every unmarked word without selecting anything',()=>{
  const line={text:'Một hai ba',start:0,end:3};const targets=[0,1,2].map(()=>({style:{setProperty(k,v){this[k]=v}},classList:{toggle(){}}}));
  for(let i=0;i<3;i++){assert.equal(cue.decorate(targets,line,i+.4,{}),i);for(let j=0;j<3;j++){assert.equal(targets[j].style['--word-scale'],i===j?'1.2500':'1.0000');assert.equal(targets[j].style['--word-line'],'0.0000')}}
  assert.equal(line.words,undefined);
});
test('karaoke global style overrides old word markings and can be disabled',()=>{
  const line={text:'Một hai',start:0,end:2};cue.update(line,0,{enlarge:true,glow:true,underline:true,scale:2});
  const targets=[0,1].map(()=>({style:{setProperty(k,v){this[k]=v}},classList:{toggle(){}}}));
  cue.decorate(targets,line,1.4,{enlarge:true,scale:1.5,glow:true,underline:false});assert.equal(targets[1].style['--word-scale'],'1.5000');assert.equal(targets[1].style['--word-glow'],'16.00px');assert.equal(targets[1].style['--word-line'],'0.0000');
  cue.decorate(targets,line,.4,{enabled:false});assert.equal(targets[0].style['--word-scale'],'1.0000');assert.equal(targets[0].style['--word-glow'],'0.00px');assert.equal(targets[0].style['--word-line'],'0.0000');
});
test('dimming keeps inactive words dim through boundaries and gaps, and clears when disabled',()=>{
  const line={text:'Một hai ba',start:0,end:3};cue.update(line,1,{start:1.2,end:1.8});const targets=[0,1,2].map(()=>({style:{setProperty(k,v){this[k]=v}},classList:{toggle(){}}}));const style=cue.preset('dim');
  cue.decorate(targets,line,1.5,style);assert.equal(targets[1].style['--word-opacity'],'1');assert.equal(targets[1].style['--word-blur'],'0px');assert.equal(targets[0].style['--word-opacity'],'0.350');assert.equal(targets[2].style['--word-blur'],'2.00px');
  for(const time of [0,.999999,1,1.1,1.2,1.20001,1.79999,1.8,2,2.00001]){const current=cue.decorate(targets,line,time,style);targets.forEach((t,i)=>{assert.equal(t.style['--word-opacity'],i===current?'1':'0.350');assert.equal(t.style['--word-blur'],i===current?'0px':'2.00px')})}
  cue.decorate(targets,line,1.5,cue.preset('none',style));assert.ok(targets.every(t=>t.style['--word-opacity']==='1'&&t.style['--word-blur']==='0px'&&t.style['--word-scale']==='1.0000'&&t.style['--word-line']==='0.0000'));
});
test('style menu selects individual modes and retains custom combinations',()=>{
  for(const [mode,key] of [['underline','underline'],['scale','enlarge'],['glow','glow'],['dim','dimOthers']]){const style=cue.preset(mode);assert.equal(cue.presetName(style),mode);assert.equal(style[key],true);assert.equal(style.enabled,true);assert.equal(['underline','enlarge','glow','dimOthers'].filter(k=>style[k]).length,1)}
  const both={enabled:true,enlarge:true,underline:true,glow:true};assert.equal(cue.presetName(both),'custom');assert.equal(cue.presetName(cue.preset('none',both)),'none');assert.equal(cue.preset('custom',both).glow,true);
});
