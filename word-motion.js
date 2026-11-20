(function(root){
  const presets=[
    ['WordPop','Pop','●','Từng từ bật ra ở giữa khung theo timing'],
    ['WordStack','Stack Build','▤','Từng từ xếp lên thành câu và giữ lại'],
    ['WordSlam','Slam','▾','Từng từ đập mạnh vào khung với rung nhẹ'],
    ['LetterBounce','Letter Bounce','↟','Ký tự rơi và nảy lần lượt theo từng từ'],
    ['WordDecode','Decode','⌘','Ký tự nhiễu giải mã thành lời đúng timing'],
    ['WordType','Type & Delete','T⌫','Gõ theo nhịp từng từ và xóa ngược lúc cuối câu']
  ].map(([id,label,icon,description])=>({id,label,icon,description,group:'word'}));
  const clamp=(t,a=0,b=1)=>Math.max(a,Math.min(b,t));
  function frame({fx='WordPop',time=0,start=0,end=1,duration=4,index=0,glyph=0,glyphCount=1,intensity=1,wordCount=1}){
    const span=Math.max(.01,end-start),delay=['LetterBounce','WordType','WordDecode'].includes(fx)?glyph/Math.max(1,glyphCount)*Math.min(.5,span*.55):0,local=time-start-delay;
    const d=Math.min(.45,span*.55),u=clamp(local/Math.max(.01,d)),spring=1-Math.exp(-6*u)*Math.cos(10*u),ease=1-Math.pow(1-u,3);
    const single=['WordPop','WordSlam'].includes(fx),out=single?clamp((time-(end-Math.min(.1,span*.15)))/Math.max(.005,Math.min(.1,span*.15))):clamp((time-(duration-.12))/.12);
    let opacity=local<0?0:1-out,x=0,y=0,rotate=0,scale=1,text=null;
    switch(fx){
      case'WordPop':scale=.3+.7*spring;y=35*(1-ease);rotate=(index%2?1:-1)*8*(1-ease);break;
      case'WordStack':y=80*(1-ease);scale=1+.07*(1-ease);break;
      case'WordSlam':scale=1+2*(1-ease);x=Math.sin(local*90)*8*Math.exp(-Math.max(0,local)*14);y=Math.cos(local*83)*6*Math.exp(-Math.max(0,local)*14);break;
      case'LetterBounce':y=-95*(1-spring);scale=1+.15*Math.sin(u*9)*(1-u);break;
      case'WordDecode':{const tick=Math.floor(Math.max(0,local)*24);if(local>=0&&local<Math.min(.32,span*.4))text='AZ01#%&?+='[(tick*7+index*5+glyph*3)%10];break;}
      case'WordType':{const erase=duration-Math.min(.5,duration*.16),progress=clamp((time-erase)/Math.max(.01,duration-erase));if(progress>0&&index+glyph/Math.max(1,glyphCount)>(1-progress)*Math.max(1,wordCount))opacity=0;break;}
    }
    intensity=clamp(Number(intensity)||0,0,1.8);return {opacity:clamp(opacity),transform:`translate3d(${(x*intensity).toFixed(3)}px,${(y*intensity).toFixed(3)}px,0) rotate(${(rotate*intensity).toFixed(3)}deg) scale(${Math.max(.05,1+(scale-1)*intensity).toFixed(4)})`,text,cursor:fx==='WordType'&&local>=0&&local<Math.min(.18,span/glyphCount+.05)};
  }
  function build(container,line){
    const list=root.LyraCue.words(line),units=[],wordNodes=[],chars=['LetterBounce','WordDecode','WordType'].includes(line.fx);
    container.classList.add('wordmotion');container.setAttribute('aria-label',line.text);
    list.forEach((word,index)=>{const shell=document.createElement('span');shell.className='wm-word';shell.dataset.word=index;shell.setAttribute('aria-hidden','true');container.append(shell);wordNodes.push(shell);
      const ink=document.createElement('span');ink.className='wm-ink';shell.append(ink);
      if(chars){const glyphs=root.LyraType.graphemes(word.text);glyphs.forEach((text,glyph)=>{const node=document.createElement('span');node.className='wm-glyph';node.textContent=text;ink.append(node);units.push({node,text,index,glyph,glyphCount:glyphs.length})})}
      else{ink.textContent=word.text;units.push({node:ink,index,glyph:0,glyphCount:1,text:word.text})}
    });return {fx:line.fx,units,wordNodes};
  }
  function paint(view,line,options){const words=root.LyraCue.words(line);if(['WordPop','WordSlam'].includes(view.fx))view.wordNodes.forEach((node,index)=>{const on=options.time>=words[index].start&&options.time<words[index].end;node.style.pointerEvents=on?'auto':'none';node.style.zIndex=on?'2':'0'});view.units.forEach(unit=>{const w=words[unit.index];if(!w)return;const f=frame({...options,fx:view.fx,start:w.start,end:w.end,index:unit.index,glyph:unit.glyph,glyphCount:unit.glyphCount,wordCount:words.length});unit.node.style.opacity=f.opacity;unit.node.style.transform=f.transform;unit.node.textContent=f.text??unit.text;unit.node.classList.toggle('wm-caret',f.cursor)})}
  const api={presets,frame,build,paint};if(typeof module!=='undefined'&&module.exports)module.exports=api;else{root.LyraWords=api;root.LyraMotion.presets.push(...presets)}
})(typeof globalThis==='undefined'?this:globalThis);
