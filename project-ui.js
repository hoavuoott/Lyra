(function(){
  const title=document.querySelector('header .project');title.innerHTML='<button id="projectname" title="Bấm để đổi tên dự án"></button><input id="projectnameinput" type="text" maxlength="100" hidden aria-label="Tên dự án"><span> / Bản nháp</span>';
  let editing=false;
  function paint(){const name=LyraProject.name(state.name);$('projectname').textContent=name;document.title=name+' — LYRA Motion Studio';if(!editing)$('projectnameinput').value=name}
  function finish(save){if(!editing)return;editing=false;if(save){state.name=LyraProject.name($('projectnameinput').value);persist()}$('projectnameinput').hidden=true;$('projectname').hidden=false;paint()}
  $('projectname').onclick=()=>{editing=true;$('projectnameinput').value=LyraProject.name(state.name);$('projectname').hidden=true;$('projectnameinput').hidden=false;$('projectnameinput').focus();$('projectnameinput').select()};
  $('projectnameinput').onblur=()=>finish(true);$('projectnameinput').onkeydown=e=>{if(e.key==='Enter'||e.key==='Escape'){e.preventDefault();e.stopPropagation();finish(e.key==='Enter');$('projectname').focus()}};
  const before=render;render=function(){before();paint()};paint();
})();
