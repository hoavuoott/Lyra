/* Original browser-native title treatments inspired by motion-graphics genres. */
(function(root){
  const featured=[
 ['TypewriterText','Typewriter','T│','Gõ từng ký tự, giữ chữ và con trỏ nhấp nháy'],
 ['KineticTypography','Kinetic Typography','Aa','Từng từ slam, xếp chồng hoặc xuất hiện riêng theo timing audio'],
 ['SlideInLetter','Slide-in Letter','→','Ký tự trượt từ bên trái, lần lượt vào vị trí'],
 ['BlurInText','Blur-in Text','◌','Từng ký tự từ mờ nhòe chuyển thành rõ nét'],
 ['FlipText','Flip Text','◫','Ký tự lật mở như những tấm thẻ'],
 ['RotateInText','Rotate-in Text','↻','Từng ký tự xoay và phóng vào khung chữ'],
 ['WipeInText','Wipe-in Text','▰','Mặt nạ quét từ trái qua từng ký tự'],
 ['StrikethroughText','Strikethrough Text','abc','Gạch ngang một từ, tùy chọn hiện chữ thay thế phía trên'],
 ['WordCloud','Word Cloud','☁','Các từ lớn nhỏ tạo đám mây chữ, giữ thứ tự đọc']
 ].map(([id,label,icon,description])=>({id,label,icon,description,group:'type',featured:true}));
 const presets=[
    ['HandDrawn','Cartoon Hand Drawn','✎','Nét vẽ tay rung nhẹ, nảy mềm và bóng nét lệch'],
['DigitalGlitch','Glitch Text Preset','≋','Lát cắt kỹ thuật số và bóng chữ nhiễu'],
['RevealGlow','Clean Reveal Glow','✦','Ký tự hiện từ lớp sáng mờ rồi chốt nét'],
['PlainTypography','Basic Plain Typography','Aa','Chữ sans đậm, zoom nhanh và nhấn từ bằng gradient tím–hồng'],
    ['MaskReveal','Mask Reveal','▰','Chữ trượt ra từ một mặt nạ ngang, giữ yên rồi trượt khuất'],
    ['Cascade','Cascading Words','≡','Từng từ đổ xuống nối tiếp, dừng gọn và rời khung theo thứ tự'],
    ['FlyingLetters','Flying Letters','A↗','Từng ký tự bay từ các hướng vào đúng vị trí'],
    ['SlidingWords','Sliding Words','⇄','Các từ trượt xen kẽ qua mặt nạ dọc'],
    ['GradientType','Gradient Highlight','◒','Dải màu nhấn chạy xuyên qua chữ, reveal nhẹ nhàng'],
    ['HighlightBar','Highlight Bars','▱','Thanh màu quét phía sau từng từ rồi thu lại'],
    ['LineReveal','Line Reveal','―','Đường kẻ mở ra, chữ trồi lên phía trên đường'],
    ['OutlineFill','Outline → Fill','Aa','Nét viền hiện trước, phần màu đầy quét vào sau'],
    ['SplitLines','Split-line Title','☷','Hai dòng chữ vào từ hai phía, bố cục tiêu đề'],
    ['LetterFlip','Letter Flip','◫','Từng ký tự lật với phối cảnh, kết thúc sạch'],
    ['TypeCursor','Clean Typewriter','T│','Gõ từng ký tự và con trỏ nhấp nháy'],
    ['BlurTitle','Cinematic Focus','◌','Tiêu đề lấy nét chậm, giãn khoảng chữ và fade mềm']
  ].map(([id,label,icon,description])=>({id,label,icon,description,group:'type',legacy:true}));
 presets.unshift(...featured);
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const cubic=t=>1-Math.pow(1-clamp(t),3);
  function graphemes(text){return typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('vi',{granularity:'grapheme'}).segment(text)].map(s=>s.segment):Array.from(text.normalize('NFC'))}
  function frame({fx='MaskReveal',index=0,count=1,time=0,duration=4,enter=.85,exit=.4,intensity=1,variant='title',wordIndex=index,wordCount=count,emphasis=-1,wordStart,wordEnd,kineticMode='slam',strike=false}){
    duration=Math.max(.08,Number(duration)||4);count=Math.max(1,count);index=clamp(index,0,count-1);intensity=clamp(Number(intensity)||0,0,1.8);
    const intro=Math.min(Math.max(.1,Number(enter)||.85),duration*.48),outro=Math.min(Math.max(.05,Number(exit)||.4),duration*.25);
    const charMode=['FlyingLetters','LetterFlip','TypeCursor','RevealGlow','TypewriterText','SlideInLetter','BlurInText','FlipText','RotateInText','WipeInText'].includes(fx)||(fx==='PlainTypography'&&variant==='tracking'),spread=charMode?.65:.42,delay=count>1?index/(count-1)*intro*spread:0;
    const incoming=clamp((time-delay)/Math.max(.01,intro*(1-spread))),p=cubic(incoming),out=clamp((time-(duration-outro))/outro),q=out*out;
    const remaining=1-p,dir=index%2?-1:1,seed=Math.sin((index+1)*12.9898)*43758.5453,angle=(seed-Math.floor(seed))*Math.PI*2;
    let strikeProgress=0,correctionProgress=0,echo=0,glow=0,x=0,y=0,r=0,rx=0,scale=1,blur=0,opacity=(time<delay?0:1)*(1-q),clip=0,spacing=0;
    switch(fx){
      case'TypewriterText':{const reveal=Math.max(.01,intro*.9),at=index/count*reveal;opacity=(time>=at?1:0)*(1-q);break;}
      case'SlideInLetter':x=-110*remaining;opacity=p*(1-q);break;
      case'BlurInText':blur=22*remaining;scale=1+.15*remaining;opacity=p*(1-q);break;
      case'FlipText':rx=-95*remaining;scale=.85+.15*p;opacity=clamp(incoming*3)*(1-q);break;
      case'RotateInText':r=-160*remaining;scale=.15+.85*p;y=18*remaining;opacity=p*(1-q);break;
      case'WipeInText':clip=100*(1-incoming);opacity=(time>=delay?1:0)*(1-q);break;
      case'KineticTypography':{const at=Number.isFinite(wordStart)?wordStart:wordIndex/Math.max(1,wordCount)*duration*.7,until=Number.isFinite(wordEnd)?wordEnd:at+duration/Math.max(1,wordCount),span=Math.max(.01,Math.min(intro,Math.max(.03,until-at)*.65)),progress=clamp((time-at)/span),settle=cubic(progress);scale=kineticMode==='stack'?1:1+(1-settle)*1.1;y=kineticMode==='stack'?95*(1-settle):0;r=kineticMode==='slam'?dir*4*(1-settle):0;opacity=(time>=at?clamp(progress*4):0)*(1-q);if(kineticMode==='solo'&&time>=until)opacity=0;break;}
      case'StrikethroughText':{opacity=p*(1-q);if(strike){strikeProgress=cubic((time-intro*.7)/Math.max(.05,Math.min(.6,duration*.22)));correctionProgress=cubic((time-intro*.7-Math.min(.35,duration*.12))/Math.max(.05,Math.min(.45,duration*.18)))}break;}
      case'WordCloud':{scale=.55+.45*p;y=22*remaining;r=dir*12*remaining;opacity=p*(1-q);break;}

case'HandDrawn':{const step=Math.floor(Math.max(0,time)*9),j=Math.sin((step+index*13)*7.91);x=j*.7;y=32*remaining+Math.cos(step*4.7+index)*.7;r=j*1.8;scale=1+.12*Math.sin(incoming*Math.PI)*remaining;opacity=p*(1-q);echo=.025;break;}
case'DigitalGlitch':{const step=Math.floor(Math.max(0,time)*24),noise=Math.sin(step*17.13+index*9.7),burst=incoming<.85||Math.sin(step*.71+index)>.94;x=(burst?noise*12:0)*Math.max(.2,remaining);y=burst?noise*2:0;clip=burst?Math.abs(noise)*12:0;echo=burst?.07:0;opacity=p*(1-q);break;}
case'RevealGlow':y=12*remaining;blur=14*remaining+5*q;glow=remaining*1.2;opacity=p*(1-q);break;

      case'PlainTypography':{
        const isKey=wordIndex===(emphasis<0?Math.floor(wordCount/2):Math.min(wordCount-1,emphasis));
        if(variant==='tracking'){x=(index-(count-1)/2)*55*remaining;y=0;opacity=p*(1-q);scale=1+.12*remaining;spacing=.18+.3*remaining;}
        else if(variant==='keyword'){y=80*remaining;scale=isKey?1+.1*remaining:1;opacity=p*(1-q);}
        else{y=90*remaining;r=0;scale=1+.04*remaining;opacity=clamp(incoming*5)*(1-q);}
        break;
      }
      case'MaskReveal':y=115*remaining-115*q;break;
      case'Cascade':y=-125*remaining+110*q;r=dir*3*remaining;break;
      case'FlyingLetters':x=Math.cos(angle)*130*remaining+dir*40*q;y=Math.sin(angle)*140*remaining-55*q;r=dir*55*remaining;scale=.55+.45*p;break;
      case'SlidingWords':x=dir*(125*remaining+115*q);clip=remaining*100;break;
      case'GradientType':y=18*remaining;opacity=p*(1-q);break;
      case'HighlightBar':y=30*remaining;opacity=clamp(incoming*3)*(1-q);break;
      case'LineReveal':y=115*remaining-110*q;break;
      case'OutlineFill':opacity=clamp(incoming*4)*(1-q);scale=1+.05*remaining;break;
      case'SplitLines':x=dir*(120*remaining+100*q);opacity=p*(1-q);break;
      case'LetterFlip':rx=-100*remaining+75*q;y=20*remaining;opacity=clamp(incoming*4)*(1-q);break;
      case'TypeCursor':opacity=(time>=delay?1:0)*(1-q);break;
      case'BlurTitle':blur=18*remaining+8*q;spacing=.16*remaining;y=8*remaining;opacity=p*(1-q);scale=1+.08*remaining;break;
    }
    const typed=clamp((time/Math.max(.01,intro*.65))*(count-1),0,count-1);
    return {strikeProgress,correctionProgress,echo:echo*intensity,glow:glow*intensity,opacity:time>=duration?0:clamp(opacity),transform:`perspective(800px) translate3d(${(x*intensity).toFixed(3)}%,${(y*intensity).toFixed(3)}%,0) rotate(${(r*intensity).toFixed(3)}deg) rotateX(${(rx*intensity).toFixed(3)}deg) scale(${(1+(scale-1)*intensity).toFixed(4)})`,filter:blur>.05?`blur(${blur.toFixed(2)}px)`:'none',clipPath:clip>0?`inset(0 ${clip.toFixed(3)}% 0 0)`:'inset(0 0 0 0)',letterSpacing:spacing.toFixed(4)+'em',fill:clamp((time-intro*.35)/Math.max(.01,intro*.65))*(1-q),plate:clamp((time-delay)/Math.max(.01,intro*.3))*(1-q),gradient:((time/Math.max(1,duration))*230-index*14).toFixed(2)+'%',rule:Math.min(cubic(time/Math.max(.01,intro*.45)),1-q),cursor:fx==='TypewriterText'?time>=0&&index===Math.min(count-1,Math.floor(time/Math.max(.01,intro*.9)*count))&&(time<intro*.9||Math.floor(time*2.5)%2===0):fx==='TypeCursor'&&index===Math.floor(typed)&&(time<intro||Math.floor(time*2.5)%2===0)};
  }
  function groupFrame({time=0,duration=4,enter=.85,exit=.4,intensity=1,variant='title'}){
    duration=Math.max(.08,duration);const intro=Math.min(Math.max(.1,enter),duration*.48),outro=Math.min(Math.max(.05,exit),duration*.25);
    const p=cubic(time/Math.max(.01,intro*.6)),q=clamp((time-(duration-outro))/outro);let scale=1,x=0;
    if(variant==='keyword'){scale=1+1.8*(1-p)+q*q*.85;x=-q*q*8;}
    else if(variant==='title')scale=1+.8*Math.pow(1-p,2)+q*q*.15;
    return {transform:`translateX(${(x*intensity).toFixed(3)}%) scale(${(1+(scale-1)*intensity).toFixed(4)})`,opacity:clamp(time<0?0:1-q*q)};
  }
  function build(container,line){
    const words=line.text.trim().split(/\s+/).filter(Boolean),variant=line.typeVariant||'title',chars=['FlyingLetters','LetterFlip','TypeCursor','RevealGlow','TypewriterText','SlideInLetter','BlurInText','FlipText','RotateInText','WipeInText'].includes(line.fx)||(line.fx==='PlainTypography'&&variant==='tracking'),units=[];
    container.classList.add('motion-v2');if(line.fx==='KineticTypography'&&line.kineticMode==='solo')container.classList.add('kinetic-solo');
    const total=chars?words.reduce((n,w)=>n+graphemes(w).length,0):words.length;
    container.classList.add('type-template');container.setAttribute('aria-label',line.text);
    if(line.fx==='PlainTypography'){container.classList.add('plain-'+variant);container.style.setProperty('--plain-size',variant==='keyword'?'1.25':'1');}
    let rows=null;if(line.fx==='SplitLines'){rows=[document.createElement('div'),document.createElement('div')];rows.forEach(row=>{row.className='type-row';container.append(row)})}
    words.forEach((word,wi)=>{
      const shell=document.createElement('span');shell.className='type-word';shell.setAttribute('aria-hidden','true');if(line.fx==='KineticTypography'){shell.classList.add('kinetic-word');shell.style.fontWeight=wi%3===2?'900':'600';if(wi%3===2){shell.classList.add('motion-accent');shell.style.fontSize='1.16em'}}
      const emphasis=Number.isInteger(line.typeEmphasis)&&line.typeEmphasis>=0?Math.min(words.length-1,line.typeEmphasis):Math.floor(words.length/2);
      if(line.fx==='PlainTypography'&&wi===emphasis)shell.classList.add('plain-emphasis');
      const host=rows?rows[wi<Math.ceil(words.length/2)?0:1]:container;host.append(shell);
      if(chars){for(const glyph of graphemes(word)){const ink=document.createElement('span');ink.className='type-glyph';ink.textContent=glyph;if(line.fx==='PlainTypography')ink.style.letterSpacing='.18em';shell.append(ink);units.push({node:ink,index:units.length,wordIndex:wi})}}
      else{const ink=document.createElement('span');ink.className='type-ink';ink.textContent=word;ink.setAttribute('data-echo',word);shell.append(ink);let fill=null,plate=null;
        if(line.fx==='OutlineFill'){fill=document.createElement('span');fill.className='type-fill';fill.textContent=word;ink.append(fill)}
        if(line.fx==='HighlightBar'){plate=document.createElement('span');plate.className='type-plate';shell.prepend(plate)}
        let strike=null,correction=null;if(line.fx==='StrikethroughText'&&wi===(Number.isInteger(line.strikeWord)?Math.min(words.length-1,Math.max(0,line.strikeWord)):words.length-1)){strike=document.createElement('span');strike.className='motion-strike';ink.append(strike);if(line.strikeReplacement?.trim()){correction=document.createElement('span');correction.className='motion-correction';correction.textContent=line.strikeReplacement.trim();ink.append(correction)}}
        units.push({node:ink,fill,plate,strike,correction,index:wi,wordIndex:wi})}
    });
    return {units,total,fx:line.fx,variant,wordCount:words.length,emphasis:line.typeEmphasis??-1,kineticMode:line.kineticMode||'slam'};
  }
  function paint(view,container,options){
    const {color='#e9ff8b',accent='#ff8fb1'}=options;container.style.setProperty('--type-accent',accent);container.style.setProperty('--lyric-color',color);
    if(view.fx==='PlainTypography'){const group=groupFrame({...options,variant:view.variant});container.style.transform=group.transform;container.style.opacity=group.opacity;}else{container.style.transform='';container.style.opacity='';}
    let rule=0;for(const unit of view.units){const f=frame({...options,fx:view.fx,index:unit.index,count:view.total,variant:view.variant,wordIndex:unit.wordIndex,wordCount:view.wordCount,emphasis:view.emphasis,kineticMode:view.kineticMode,wordStart:options.wordWindows?.[unit.wordIndex]?.start,wordEnd:options.wordWindows?.[unit.wordIndex]?.end,strike:!!unit.strike}),node=unit.node;
      node.style.setProperty('--echo-shift',f.echo.toFixed(4)+'em');node.style.textShadow=f.glow>0?`0 0 ${f.glow.toFixed(3)}em ${accent},0 0 ${(f.glow*.4).toFixed(3)}em ${accent}`:'none';node.classList.toggle('glitch-burst',view.fx==='DigitalGlitch'&&f.echo>0);node.style.transform=f.transform;node.style.opacity=f.opacity;node.style.filter=f.filter;node.style.clipPath=['StrikethroughText','TypewriterText','TypeCursor'].includes(view.fx)?'none':f.clipPath;node.style.letterSpacing=f.letterSpacing;
      if(unit.strike)unit.strike.style.transform=`scaleX(${f.strikeProgress.toFixed(4)})`;if(unit.correction){unit.correction.style.opacity=f.correctionProgress;unit.correction.style.transform=`translateY(${(-100-(1-f.correctionProgress)*25).toFixed(2)}%) rotate(-4deg) scale(${(.8+.2*f.correctionProgress).toFixed(4)})`;}node.classList.toggle('type-cursor',f.cursor);if(view.fx==='GradientType')node.style.backgroundPosition=f.gradient+' 50%';
      if(unit.fill)unit.fill.style.clipPath=`inset(0 ${((1-f.fill)*100).toFixed(2)}% 0 0)`;
      if(unit.plate)unit.plate.style.transform=`scaleX(${f.plate.toFixed(4)})`;
      rule=f.rule;
    }container.style.setProperty('--type-rule',rule.toFixed(4));
  }
  const api={presets,featured,frame,groupFrame,graphemes,build,paint};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else{root.LyraType=api;root.LyraMotion.presets.push(...presets)}
})(typeof globalThis==='undefined'?this:globalThis);
