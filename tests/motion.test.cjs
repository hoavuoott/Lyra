const test=require('node:test'),assert=require('node:assert/strict');
const {presets,frame}=require('../motion-engine.js');
test('every effect produces finite, repeatable frames across short and long cues',()=>{
  for(const {id} of presets)for(const duration of [.08,.3,4,30])for(const count of [1,5,60])for(const time of [0,duration*.1,duration*.5,duration-.001]){
    const input={fx:id,index:count-1,count,time,duration,bpm:125,intensity:1.8};const f=frame(input);
    assert.deepEqual(f,frame(input),id+' seek must reproduce exactly');
    assert.ok(!/NaN|Infinity/.test(JSON.stringify(f)),id);assert.ok(f.opacity>=0&&f.opacity<=1,id);
  }
});
test('zero intensity removes spatial movement and cue ends fade out',()=>{
  for(const {id} of presets){let f=frame({fx:id,time:1,intensity:0});assert.match(f.transform,/translate3d\(0.000px,0.000px,0\)/);assert.match(f.transform,/scale\(1.000,1.000\)/);assert.equal(frame({fx:id,time:4,duration:4}).opacity,0)}
});
test('bounce continues on the beat and responds to BPM',()=>{
  const input={fx:'Bounce',index:0,count:5,time:1.3,duration:4};
  assert.notEqual(frame({...input,bpm:90}).transform,frame({...input,bpm:140}).transform);
  assert.notEqual(frame({...input,time:1}).transform,frame({...input,time:1.2}).transform);
});
test('all preset ids are unique and old project effects remain supported',()=>{
  assert.equal(new Set(presets.map(p=>p.id)).size,20);
  for(const id of ['Rise','Typewriter','Blur','Bounce','Glitch','Wave','Zoom','Rotate','Slide','Flip','Tracking','Karaoke'])assert.ok(presets.some(p=>p.id===id));
});
