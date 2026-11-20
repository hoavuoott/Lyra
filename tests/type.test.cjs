const test=require('node:test'),assert=require('node:assert/strict');
const {presets,frame,graphemes,build,paint}=require('../type-engine.js');
test('title frames remain deterministic on seek, including very short cues',()=>{
  for(const {id} of presets)for(const duration of [.08,.3,4,25])for(const count of [1,8,100])for(const time of [-.1,0,duration*.2,duration*.7,duration]){
    const args={fx:id,index:count-1,count,time,duration,enter:2,exit:1,intensity:1.8},result=frame(args);
    assert.deepEqual(result,frame(args),id);assert.ok(!/NaN|Infinity/.test(JSON.stringify(result)),id);assert.ok(result.opacity>=0&&result.opacity<=1);assert.ok(result.plate>=0&&result.plate<=1);if(time===duration)assert.equal(result.opacity,0);
  }
});
test('Vietnamese letters and combining accents stay together',()=>{
  const phrase='Để câu chuyện ngân vang';assert.equal(graphemes(phrase).join(''),phrase);
  assert.equal(graphemes('a\u0301').length,1);assert.equal(graphemes('👩‍🎤').length,1);
});
test('cascading delay and entry duration respond to controls',()=>{
  assert.equal(frame({fx:'Cascade',index:5,count:6,time:.02}).opacity,0);
  assert.ok(frame({fx:'Cascade',index:5,count:6,time:1}).opacity>0);
  assert.notEqual(frame({fx:'MaskReveal',time:.3,enter:.5}).transform,frame({fx:'MaskReveal',time:.3,enter:2}).transform);
});
class Element{constructor(){this.children=[];this.style={setProperty(k,v){this[k]=v}};this.attrs={};this.classList={add(){},toggle(){}}}append(n){this.children.push(n)}prepend(n){this.children.unshift(n)}setAttribute(k,v){this.attrs[k]=v}}
test('each renderer handles real lyric text, plates, outlines and glyphs without a DOM error',()=>{
  global.document={createElement(){return new Element()}};
  for(const {id} of presets){const container=new Element(),text='Để câu chuyện ngân vang',view=build(container,{fx:id,text});assert.equal(container.attrs['aria-label'],text);assert.ok(view.total>=5);for(const time of [0,.2,2,3.99])paint(view,container,{time,duration:4,color:'#fff',accent:'#f09'});assert.ok(view.units.every(u=>u.node.style.transform&&!u.node.style.transform.includes('NaN')));if(id==='HighlightBar')assert.ok(view.units.every(u=>u.plate.style.transform));if(id==='OutlineFill')assert.ok(view.units.every(u=>u.fill.style.clipPath));}
  delete global.document;
});
test('cursor and correction render outside the ink bounds without clipping',()=>{global.document={createElement(){return new Element()}};try{for(const fx of ['TypewriterText','StrikethroughText']){const container=new Element(),view=build(container,{fx,text:'Xin chào',strikeReplacement:'hello'});paint(view,container,{time:2,duration:4});assert.ok(view.units.every(u=>u.node.style.clipPath==='none'));if(fx==='StrikethroughText')assert.equal(view.units.find(u=>u.correction).correction.style.opacity,1)}}finally{delete global.document}});
test('unique styles include compatibility renderers',()=>{const old=require('../motion-engine.js').presets;assert.equal(new Set([...old,...presets].map(p=>p.id)).size,45)});
test('Basic Plain variants retain separate layouts and reproduce zoom on seek',()=>{
  const {groupFrame}=require('../type-engine.js');
  assert.notEqual(groupFrame({time:.05,variant:'title'}).transform,groupFrame({time:.05,variant:'keyword'}).transform);
  assert.deepEqual(groupFrame({time:.2,variant:'keyword'}),groupFrame({time:.2,variant:'keyword'}));
  assert.match(groupFrame({time:2,variant:'title'}).transform,/scale\(1.0000\)/);
  for(const variant of ['title','tracking','keyword'])for(const time of [0,.1,1,3.9])assert.ok(!/NaN|Infinity/.test(JSON.stringify(frame({fx:'PlainTypography',variant,time,count:20,index:19}))));
});
