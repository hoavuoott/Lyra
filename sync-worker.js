let library=null,transcriber=null,loadedModel='';
self.onmessage=async event=>{const {id,pcm,model,language}=event.data;const send=(type,data={})=>self.postMessage({id,type,...data});try{
  send('stage',{message:'Đang chuẩn bị thư viện AI…'});
  library??=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js');
  library.env.allowLocalModels=false;library.env.useBrowserCache=true;library.env.backends.onnx.wasm.numThreads=1;library.env.backends.onnx.wasm.proxy=false;library.env.backends.onnx.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/';
  const chosen=['tiny','base','small'].includes(model)?model:'base';
  if(!transcriber||loadedModel!==chosen){if(transcriber)await transcriber.dispose();transcriber=null;loadedModel='';send('stage',{message:'Đang tải mô hình Whisper '+chosen+' về máy…'});transcriber=await library.pipeline('automatic-speech-recognition','Xenova/whisper-'+chosen,{device:'wasm',dtype:'q8',progress_callback:progress=>send('download',{file:progress.file,status:progress.status,loaded:progress.loaded,total:progress.total,progress:progress.progress})});loadedModel=chosen}
  send('stage',{message:'Đang nhận dạng và lấy timing từng từ. Có thể mất vài phút…'});
  const options={return_timestamps:'word',chunk_length_s:30,stride_length_s:5,task:'transcribe',num_beams:1,do_sample:false};if(language&&language!=='auto')options.language=language;
  const result=await transcriber(pcm,options);send('result',{chunks:result.chunks||[],text:result.text||''});
}catch(error){send('error',{message:error?.message||String(error)})}};
