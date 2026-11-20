(function(){
  const history=LyraHistory.create(state);let restoring=false,group=null,serial=0;
  const actions=document.createElement('div');actions.className='history-actions';actions.innerHTML='<button id="undoproject" title="Ctrl+Z">Hoàn tác</button><button id="redoproject" title="Ctrl+Shift+Z">Làm lại</button>';
  document.querySelector('.timelinehead').append(actions);
  function buttons(){$('undoproject').disabled=!history.canUndo;$('redoproject').disabled=!history.canRedo}
  const save=persist;persist=function(){if(!restoring)history.record(state,group);save();buttons()};
  function restore(next){if(!next)return;restoring=true;try{stopCueLoop();state=next;selected=Math.min(selected,state.lines.length-1);selectedWord=0;render();seek(Math.min(time,duration));status('Đã '+(history.canRedo?'hoàn tác':'làm lại')+' chỉnh sửa.')}finally{restoring=false;buttons()}}
  $('undoproject').onclick=()=>restore(history.undo());$('redoproject').onclick=()=>restore(history.redo());
  document.addEventListener('pointerdown',()=>{group=++serial},true);
  document.addEventListener('pointerup',()=>setTimeout(()=>{group=null},0));
  document.addEventListener('pointercancel',()=>{group=null});
  document.addEventListener('keydown',e=>{
    if(e.isComposing)return;if(window.LyraExportBusy){if(e.code==='Space'||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z')){e.preventDefault();e.stopImmediatePropagation()}return;}
    if((e.code==='Space'||e.key===' ')&&!e.target.matches('#projectnameinput,#decorationpanel textarea')){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)$('play').click();return}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){
      e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
      // Commit the focused field's change before taking its undo snapshot.
      const focused=document.activeElement;if(focused?.matches('input,textarea'))focused.blur();
      group=null;restore(e.shiftKey?history.redo():history.undo());return;
    }
    if(!e.repeat&&e.target.matches('input[type=range],input[type=number]'))group=++serial;
  },true);
  document.addEventListener('keyup',()=>{group=null});buttons();
})();
