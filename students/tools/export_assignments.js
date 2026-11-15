// Keep the downloadable student handouts in sync with the website's cases.
const fs=require('fs');
const path=require('path');
global.window={COURSES:[]};
require('../assignments/cases.js');
const course=window.COURSES[0];
const folder=path.resolve(__dirname,'../assignments');
function plain(html){const tick=String.fromCharCode(96);return html.replace(/<code>(.*?)<\/code>/g,(_,value)=>tick+value+tick).replace(/<strong>(.*?)<\/strong>/g,'**$1**').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');}
for(const lesson of course.lessons){
  const assignment=lesson.blocks.find(b=>b.type==='assignment');
  const intro=lesson.blocks.filter(b=>b.type==='p').map(b=>plain(b.html));
  const lines=['# '+lesson.title,'',lesson.lead,'',...intro.flatMap(x=>[x,'']),'## Данные',''];
  for(const dataset of lesson.datasets)lines.push('- ['+dataset.name+'](../datasets/'+path.basename(dataset.url)+')');
  lines.push('','## Задания','');
  assignment.items.forEach((item,index)=>lines.push((index+1)+'. '+item));
  lines.push('','## Что сдать','',assignment.deliverable,'');
  const file=path.join(folder,lesson.id+'.md');
  fs.writeFileSync(file,lines.join('\n'),'utf8');
  console.log(path.basename(file));
}
