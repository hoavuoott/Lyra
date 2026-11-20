(function(root){
 // Keep renderers for old projects; omit near-duplicate choices from the picker.
 const superseded={TypeCursor:'TypewriterText',LetterFlip:'FlipText',WordStack:'KineticTypography',WordSlam:'KineticTypography'};
 function list(presets){return presets.filter(p=>!superseded[p.id])}
 const api={superseded,list};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LyraLibrary=api;
})(typeof globalThis==='undefined'?this:globalThis);
