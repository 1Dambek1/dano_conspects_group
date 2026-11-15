(function(){
const oldRender=window.renderLab,oldAttach=window.attachLabs;
const kinds=[
  ['hist','Гистограмма'],
  ['box','Boxplot'],
  ['scatter','Рассеяние'],
  ['bar','Столбцы'],
  ['line','Линия'],
  ['heat','Тепловая карта']
];
window.renderLab=function(kind){
  if(kind!=='plot-gallery')return oldRender(kind);
  return '<div class="lab-card plot-gallery" data-lab="plot-gallery"><div class="lab-top"><div><h4>Выбери график по вопросу</h4><p>Наведи на точку или столбец, чтобы увидеть значение.</p></div><span class="lab-tag">ГРАФИКИ</span></div><div class="lab-buttons">'+kinds.map(([id,name])=>'<button class="lab-button" data-chart="'+id+'" type="button">'+name+'</button>').join('')+'</div><div class="chart-wrap"><svg viewBox="0 0 650 265" role="img" aria-label="Пример графика pandas"></svg></div><p class="plot-caption" data-role="plot-caption"></p><pre class="plot-code" data-role="plot-code"></pre></div>';
};
const title=(text,x,y)=>'<text x="'+x+'" y="'+y+'" fill="#5e766b" font-size="11" text-anchor="middle">'+text+'</text>';
function axes(){return '<path d="M54 22V218H620" fill="none" stroke="#9fb9ac" stroke-width="1.5"/>';}
function hist(){const values=[2,5,12,19,17,10,5,2],max=20;return axes()+values.map((v,i)=>{const x=70+i*65,y=216-v/max*170;return '<rect x="'+x+'" y="'+y+'" width="57" height="'+(216-y)+'" rx="3" fill="#73a995"><title>Интервал '+(40+i*7)+'–'+(47+i*7)+': '+v+' наблюдений</title></rect>';}).join('')+title('Значение →',337,246);}
function box(){const vals=[85,170,300,455,565];return axes()+'<path d="M'+vals[0]+' 125H'+vals[4]+'" stroke="#357967" stroke-width="3"/><path d="M'+vals[0]+' 100V150M'+vals[4]+' 100V150" stroke="#357967" stroke-width="3"/><rect x="'+vals[1]+'" y="78" width="'+(vals[3]-vals[1])+'" height="94" fill="#d5e9de" stroke="#357967" stroke-width="3"/><path d="M'+vals[2]+' 78V172" stroke="#b66c52" stroke-width="4"/><circle cx="595" cy="125" r="7" fill="#b66c52"><title>Возможный выброс</title></circle>'+title('Q1',vals[1],197)+title('медиана',vals[2],197)+title('Q3',vals[3],197);}
function scatter(){let dots='';const pts=[[1,2],[1.4,2.1],[2,2.5],[2.3,3.4],[3,3.2],[3.4,4.1],[4,4],[4.6,4.7],[5,5.2],[5.5,4.8],[6,6.2],[6.6,6.1],[7,6.7],[7.3,6.4],[8,7.6],[8.5,7.2]];for(const [x,y] of pts)dots+='<circle cx="'+(65+x*61)+'" cy="'+(207-y*22)+'" r="6" fill="#357967" opacity=".75"><title>x='+x+', y='+y+'</title></circle>';return axes()+dots+title('Признак X →',336,246);}
function bar(){const labels=['Север','Центр','Юг','Берег'],v=[62,81,58,73];return axes()+v.map((y,i)=>{const x=90+i*125,h=y*1.75;return '<rect x="'+x+'" y="'+(216-h)+'" width="82" height="'+h+'" rx="4" fill="'+(i===1?'#b66c52':'#73a995')+'"><title>'+labels[i]+': '+y+'</title></rect>'+title(labels[i],x+41,239);}).join('');}
function line(){const v=[40,48,42,61,68,63,80,77],pts=v.map((y,i)=>(75+i*72)+','+(212-y*2));return axes()+'<polyline points="'+pts.join(' ')+'" fill="none" stroke="#357967" stroke-width="3"/>'+v.map((y,i)=>'<circle cx="'+(75+i*72)+'" cy="'+(212-y*2)+'" r="5" fill="#b66c52"><title>Период '+(i+1)+': '+y+'</title></circle>').join('')+title('Время →',337,246);}
function heat(){const values=[[1,.72,-.18],[.72,1,-.45],[-.18,-.45,1]],names=['часы','балл','цена'];let out='';for(let i=0;i<3;i++){out+=title(names[i],70,82+i*50);out+=title(names[i],156+i*94,40);for(let j=0;j<3;j++){const v=values[i][j],color=v>.8?'#2b7965':v>.3?'#8fc0a6':v<-.3?'#db9d80':'#e2e9df';out+='<rect x="'+(120+j*94)+'" y="'+(52+i*50)+'" width="82" height="44" rx="4" fill="'+color+'"><title>'+names[i]+' и '+names[j]+': '+v.toFixed(2)+'</title></rect>'+title(v.toFixed(2),161+j*94,80+i*50);}}return out;}
const info={
  hist:['Один числовой столбец: где находятся значения и есть ли асимметрия.','df["route_rating"].plot.hist(bins=20)'],
  box:['Медиана, квартили и потенциальные выбросы. Полезно сравнивать группы.','df.boxplot(column="route_rating", by="district")'],
  scatter:['Два числовых признака: форма связи, группы и необычные точки.','df.plot.scatter(x="wayfinding_score", y="route_rating")'],
  bar:['Сравнение категорий после подсчёта среднего или количества.','df.groupby("district")["route_rating"].mean().plot.bar()'],
  line:['Последовательность во времени: сначала отсортируй даты.','daily.sort_values("date").plot.line(x="date", y="visitors")'],
  heat:['Много попарных корреляций; цвет показывает знак и величину.','plt.imshow(df[numeric_cols].corr(), vmin=-1, vmax=1)']
};
const svg={hist,box,scatter,bar,line,heat};
function show(card,kind){card.querySelectorAll('[data-chart]').forEach(button=>button.classList.toggle('active',button.dataset.chart===kind));card.querySelector('svg').innerHTML=svg[kind]();card.querySelector('[data-role="plot-caption"]').textContent=info[kind][0];card.querySelector('[data-role="plot-code"]').textContent=info[kind][1];}
window.attachLabs=function(root){oldAttach(root);root.querySelectorAll('[data-lab="plot-gallery"]').forEach(card=>{card.querySelectorAll('[data-chart]').forEach(button=>button.addEventListener('click',()=>show(card,button.dataset.chart)));show(card,'hist');});};
})();
