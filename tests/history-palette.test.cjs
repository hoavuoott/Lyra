const test=require('node:test'),assert=require('node:assert/strict'),{create}=require('../history-core.js'),palette=require('../palette-core.js');
test('history groups a continuous drag, skips selection saves, and supports branching after undo',()=>{
 const h=create({time:1});h.record({time:2},'drag');h.record({time:3},'drag');h.record({time:3});assert.deepEqual(h.undo(),{time:1});assert.deepEqual(h.redo(),{time:3});h.record({time:4},'color');assert.deepEqual(h.undo(),{time:3});h.record({time:5},'edit');assert.equal(h.canRedo,false);assert.deepEqual(h.undo(),{time:3});assert.deepEqual(h.undo(),{time:1});assert.equal(h.undo(),null);
});
test('history snapshots isolate nested cue edits and limit retained steps',()=>{
 const state={lines:[{start:0,palette:{accent:'#ff0000'}}]},h=create(state,2);state.lines[0].start=1;h.record(state);state.lines[0].palette.accent='#00ff00';h.record(state);state.lines[0].start=2;h.record(state);assert.equal(h.undo().lines[0].start,1);assert.equal(h.undo().lines[0].palette.accent,'#ff0000');assert.equal(h.undo(),null);
});
test('effect palette supports cue overrides, inherited colors and safe imported values',()=>{
 const state={color:'#123456',motion:{accent:'#abcdef'}};assert.deepEqual(palette.resolve(state,{palette:{accent:'#00ff00'}}),{color:'#123456',accent:'#00ff00'});assert.deepEqual(palette.resolve(state,{palette:{color:'url(bad)',accent:'invalid'}}),{color:'#123456',accent:'#abcdef'});assert.ok(palette.accented.includes('HighlightBar'));assert.ok(palette.accented.includes('RevealGlow'));assert.equal(palette.valid('#fff'),false);
});
