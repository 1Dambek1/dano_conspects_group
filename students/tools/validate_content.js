const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)]
  .map(match=>match[1]).filter(src=>!src.startsWith('http'));
for(const src of scripts)assert(fs.existsSync(path.join(root,src)),src+' missing');
const window={COURSES:[]};
const context=vm.createContext({window});
for(const src of scripts.filter(x=>x!=='app.js')){
  vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),context,{filename:src});
}
const courses=window.COURSES;
assert.deepStrictEqual(courses.map(c=>c.id),['python','pandas','probability','statistics','dano','trainer']);
assert.equal(new Set(courses.map(c=>c.id)).size,courses.length);
let exercises=0,assignments=0,formulas=0,drills=0,projects=0;
for(const course of courses){
  assert(course.lessons.length>0);
  assert.equal(new Set(course.lessons.map(l=>l.id)).size,course.lessons.length);
  for(const lesson of course.lessons){
    assert(lesson.title&&lesson.lead&&lesson.blocks.length);
    for(const block of lesson.blocks){
      assert(['p','h','callout','table','formula','code','example','exercise','interactive','assignment','drillset','project'].includes(block.type));
      if(block.type==='exercise'){exercises++;assert(block.title&&block.prompt&&block.hint&&block.solution);}
      if(block.type==='assignment'){
        assignments++;
        assert(block.items.length>=4&&block.deliverable);
        for(const file of lesson.datasets||[])assert(fs.existsSync(path.join(root,file.url)),file.url+' missing');
      }
      if(block.type==='drillset'){drills+=block.items.length;assert(block.items.length>=8&&block.items.every(Boolean));}
      if(block.type==='project'){projects++;assert(block.steps.length>=3&&block.deliverable);}
      if(block.type==='formula'){
        formulas++;
        assert(block.tex.includes('\\'),lesson.id+' formula lost backslashes');
        let level=0;
        for(const ch of block.tex){if(ch==='{')level++;else if(ch==='}')level--;assert(level>=0);}
        assert.equal(level,0,lesson.id+' formula braces');
      }
      if(block.type==='interactive')assert(window.renderLab(block.kind),block.kind+' missing lab');
    }
  }
  if(course.id==='trainer')for(const lesson of course.lessons)for(const file of lesson.datasets||[])assert(fs.existsSync(path.join(root,file.url)),file.url+' missing');
}
assert.equal(assignments,5);
assert.equal(drills,154);
assert.equal(projects,12);
console.log('PASS:',courses.length,'courses,',exercises,'practice tasks,',drills,'drills,',projects,'projects,',assignments,'cases,',formulas,'formulas');
