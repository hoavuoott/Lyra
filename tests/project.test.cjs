const test=require('node:test'),assert=require('node:assert/strict'),project=require('../project-core.js');
test('project titles retain Vietnamese and produce usable export filenames',()=>{
 assert.equal(project.name('  Lời của tôi  '),'Lời của tôi');assert.equal(project.name('   '),'Untitled session');assert.equal(project.filename('Lời của tôi','json'),'Lời của tôi.json');assert.equal(project.filename('A/B: C?','lrc'),'A-B- C-.lrc');assert.equal(project.filename(undefined,'json'),'lyra-project.json');assert.equal(project.name('x'.repeat(200)).length,100);
});
test('decoration migrates the old combined switch and keeps four independent optional strings',()=>{
 const old=project.decoration({background:{decor:true}});assert.equal(old.grid,true);assert.equal(old.orbit,true);assert.deepEqual(old.corners,{tl:'',tr:'',bl:'',br:''});
 const state={background:{decor:true},decoration:{grid:false,orbit:true,corners:{tl:'Bài hát',br:'Tác giả',tr:'<img onerror=x>'},size:100,inset:-1}};
 const result=project.decoration(JSON.parse(JSON.stringify(state)));assert.equal(result.grid,false);assert.equal(result.orbit,true);assert.equal(result.corners.br,'Tác giả');assert.equal(result.corners.bl,'');assert.equal(result.corners.tr,'<img onerror=x>');assert.equal(result.size,40);assert.equal(result.inset,1);
});
