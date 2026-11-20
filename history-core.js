(function(root){
  function create(initial,limit=50){
    let entries=[JSON.stringify(initial)],index=0,lastGroup=null;
    return {
      record(value,group=null){const next=JSON.stringify(value);if(next===entries[index])return false;entries=entries.slice(0,index+1);if(group!==null&&lastGroup===group&&index>0)entries[index]=next;else{entries.push(next);index++;if(entries.length>limit+1){entries.shift();index--}}lastGroup=group;return true},
      undo(){lastGroup=null;if(index===0)return null;return JSON.parse(entries[--index])},
      redo(){lastGroup=null;if(index===entries.length-1)return null;return JSON.parse(entries[++index])},
      get canUndo(){return index>0},get canRedo(){return index<entries.length-1}
    };
  }
  const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraHistory=api;
})(typeof globalThis==='undefined'?this:globalThis);
