/* Pure timeline-driven motion: the same audio time always gives the same frame. */
(function(root){
  const presets=[
    ['Rise','Bật nhịp','↗','Từng từ vọt lên, xoay nhẹ và đáp xuống theo nhịp'],
    ['Typewriter','Gõ bật','T_','Từ xuất hiện theo nhịp với cú bật nhỏ'],
    ['Blur','Lấy nét','◌','Lao qua lớp mờ rồi chốt nét'],
    ['Bounce','Nảy đàn hồi','↟','Rơi, ép dẹt, bật lên và tiếp tục nhún theo beat'],
    ['Glitch','Lệch sóng','≋','Cắt nhịp, lệch màu và giật vị trí'],
    ['Wave','Sóng chữ','∿','Cả câu uốn lượn theo từng từ'],
    ['Zoom','Zoom impact','⊕','Phóng lớn đột ngột rồi co về đúng nhịp'],
    ['Rotate','Xoáy vào','↻','Từ xoay ngược chiều xen kẽ'],
    ['Slide','Trượt chéo','→','Các từ lao vào từ hai phía'],
    ['Flip','Lật 3D','◈','Lật từng từ với phối cảnh và độ nảy'],
    ['Tracking','Giãn nhịp','↔','Co giãn khoảng chữ theo nhịp'],
    ['Karaoke','Karaoke pop','▰','Tô sáng và bật lần lượt từng từ'],
    ['Kinetic','Kinetic cut','✦','Bố cục hai tầng, nhấn từ lớn và cắt chuyển động'],
    ['Stomp','Dậm nhịp','▾','Chữ dậm xuống, ép dẹt và nảy theo beat'],
    ['Scatter','Bung từ','✴','Các từ bung từ tâm rồi ráp thành câu'],
    ['Pendulum','Con lắc','⌁','Đung đưa từ điểm treo với quán tính'],
    ['Orbit','Quỹ đạo','◎','Từ vòng vào theo đường cong xoắn'],
    ['Stack','Xếp tầng','▤','Từng từ xếp thành tầng, lệch nhịp'],
    ['Elastic','Dây thun','〰','Kéo dài, ép ngang và bật về'],
    ['Split','Chia hướng','⋈','Hai nửa câu tách hướng rồi ráp nhịp']
  ].map(([id,label,icon,description])=>({id,label,icon,description}));
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  function frame({fx='Rise',index=0,count=1,time=0,duration=4,bpm=110,intensity=1}){
    count=Math.max(1,count);duration=Math.max(.08,duration);bpm=clamp(Number(bpm)||110,40,240);intensity=clamp(Number(intensity)||0,0,1.8);
    const dir=index%2?-1:1,beat=60/bpm,stagger=Math.min(.13,duration*.28/count),local=time-index*stagger;
    const u=clamp(local/Math.min(.65,duration*.55)),ease=1-Math.pow(1-u,3),rest=1-ease;
    const spring=u===1?1:1-Math.exp(-6*u)*Math.cos(11*u), phase=((Math.max(0,time)/beat-index*.13)%1+1)%1;
    const kick=Math.pow(1-phase,5)*clamp((local-.12)*4),wave=Math.sin(time/beat*Math.PI*2-index*.8);
    let x=0,y=0,r=0,sx=1,sy=1,rx=0,ry=0,blur=0,opacity=local<0?0:1,tracking=0,shadow='none',lit=true;
    const tail=clamp((duration-time)/Math.min(.15,duration*.08));opacity*=tail;
    switch(fx){
      case'Rise': y=85*(1-spring)-8*kick;r=dir*14*rest;sx=1+.07*kick;sy=1-.06*kick;break;
      case'Typewriter':opacity*=local>=0?1:0;y=-12*kick;sx=1+.12*kick;sy=1-.08*kick;break;
      case'Blur':x=dir*85*rest;y=-14*wave*(1-rest);blur=16*rest;sx=1+.35*rest+.025*kick;break;
      case'Bounce': y=-110*(1-spring)-22*kick;sx=1+.23*Math.sin(u*Math.PI*3)*rest+.15*kick;sy=1-.22*Math.sin(u*Math.PI*3)*rest-.12*kick;r=dir*8*rest;break;
      case'Glitch':{const hit=Math.sin(time*25+index*4)>.78?kick:0;x=dir*(80*rest+12*hit);y=dir*4*hit;r=dir*8*hit;sx=1+.1*hit;shadow=hit>.1?'4px 0 #ff5599, -4px 0 #55ddff':'none';break;}
      case'Wave':y=60*rest+18*wave*ease;r=wave*5*ease;sx=sy=1+.06*wave*ease;break;
      case'Zoom':sx=sy=1+2.5*rest+.08*kick;y=dir*15*rest;blur=5*rest;r=dir*7*rest;break;
      case'Rotate':r=dir*(140*rest+4*wave*ease);sx=sy=.25+.75*spring;y=40*rest;break;
      case'Slide':x=dir*(160*rest+5*kick);y=dir*30*rest;r=dir*12*rest;break;
      case'Flip':rx=100*(1-spring);ry=dir*30*rest;y=30*rest;sx=sy=1+.04*kick;break;
      case'Tracking':tracking=.35*rest+.025*wave*ease;sx=1+.08*kick;y=dir*4*kick;break;
      case'Karaoke':{const word=Math.min(count-1,Math.floor(time/duration*count));lit=index<=word;opacity*=lit?1:.3;const hit=index===word?Math.pow(1-(time/duration*count%1),3):0;y=-16*hit;sx=sy=1+.17*hit;break;}
      case'Kinetic':x=dir*120*rest;y=65*(1-spring)-7*kick;r=dir*(12*rest+2*kick);sx=sy=(index%3===0?1.18:.94)*(1+.07*kick);break;
      case'Stomp':y=-130*rest+9*kick;sx=1+.25*kick;sy=1-.22*kick;r=dir*3*rest;break;
      case'Scatter':{let a=index*2.399;x=Math.cos(a)*190*rest;y=Math.sin(a)*130*rest-7*kick;r=dir*100*rest;sx=sy=.15+.85*spring;break;}
      case'Pendulum':r=dir*45*Math.exp(-u*3)*Math.cos(u*9)+6*wave*ease;y=-55*rest;break;
      case'Orbit':{let a=(1-u)*Math.PI*2+index*.7;x=Math.cos(a)*110*rest;y=Math.sin(a)*80*rest-8*kick;r=dir*40*rest;sx=sy=.3+.7*ease;break;}
      case'Stack':x=dir*110*rest;y=-65*(1-spring)-8*kick;r=dir*(7*rest+1.8*kick);sx=sy=1+.05*kick;break;
      case'Elastic':sx=1+1.2*Math.exp(-5*u)*Math.sin(12*u);sy=1-.5*Math.exp(-5*u)*Math.sin(12*u);x=dir*70*rest;y=-8*kick;break;
      case'Split':x=dir*(170*rest+10*kick);y=dir*45*rest;r=dir*13*rest;sx=1+.08*kick;sy=1-.07*kick;break;
      default:y=70*rest;
    }
    // Preserve readability when motion is dialled down, without changing timing.
    x*=intensity;y*=intensity;r*=intensity;rx*=intensity;ry*=intensity;sx=1+(sx-1)*intensity;sy=1+(sy-1)*intensity;
    return {opacity:clamp(opacity),transform:`perspective(700px) translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0) rotate(${r.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${Math.max(.08,sx).toFixed(3)},${Math.max(.08,sy).toFixed(3)})`,filter:blur>.05?`blur(${blur.toFixed(2)}px)`:'none',letterSpacing:tracking.toFixed(4)+'em',textShadow:shadow,lit};
  }
  const api={presets,frame};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraMotion=api;
})(typeof globalThis==='undefined'?this:globalThis);
