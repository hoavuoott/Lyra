(function(root){
  function dimensions(ratio='16/9',quality=1080){const edge=quality===720?720:1080;return ratio==='9/16'?{width:edge,height:edge*16/9}:ratio==='1/1'?{width:edge,height:edge}:{width:edge*16/9,height:edge}}
  function range(duration,line,offset=0,selected=false){if(!Number.isFinite(duration)||duration<=0)throw Error('Thời lượng video không hợp lệ.');const start=selected?Math.max(0,line.start+offset):0,end=selected?Math.min(duration,line.end+offset):duration;if(end<=start)throw Error('Ô thoại nằm ngoài thời lượng audio.');return {start,end,duration:end-start}}
  function frame(index,fps,duration){const time=index/fps;return {time,duration:Math.min(1/fps,duration-time)}}
  function audioSlice(buffer,start,end){const from=Math.round(start*buffer.sampleRate),to=Math.min(buffer.length,Math.round(end*buffer.sampleRate));return {from,to,frames:Math.max(0,to-from)}}
  const api={dimensions,range,frame,audioSlice};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraVideo=api;
})(typeof globalThis==='undefined'?this:globalThis);
