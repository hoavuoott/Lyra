const test=require('node:test'),assert=require('node:assert/strict'),loop=require('../loop-engine.js'),type=require('../type-engine.js');
test('loop clips to actual audio and preserves fractional overshoot',()=>{
 const r=loop.range(4.5,8.5,8);assert.deepEqual(r,{start:4.5,end:8});assert.equal(loop.wrap(8,r),4.5);assert.ok(Math.abs(loop.wrap(8.1,r)-4.6)<1e-8);assert.equal(loop.wrap(0,r),4.5);assert.equal(loop.range(9,12,8),null);assert.deepEqual(loop.range(-1,2,8),{start:0,end:2});
});
test('new text effects retain color-driven glow and deterministic motion',()=>{
 for(const fx of ['HandDrawn','DigitalGlitch','RevealGlow']){const a={fx,time:.12,index:2,count:8};assert.deepEqual(type.frame(a),type.frame(a));assert.equal(type.frame({...a,time:4,duration:4}).opacity,0)}
 assert.ok(type.frame({fx:'RevealGlow',time:.1}).glow>0);assert.notEqual(type.frame({fx:'HandDrawn',time:1}).transform,type.frame({fx:'HandDrawn',time:1.2}).transform);
});
