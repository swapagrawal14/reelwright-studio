export const RIGS=Object.freeze({'starter-boy':{id:'starter-boy',label:'Starter boy',palette:{skin:'#F1BD79',hair:'#513B33',shirt:'#4386D6'}},'starter-girl':{id:'starter-girl',label:'Starter girl',palette:{skin:'#F1BD79',hair:'#604438',shirt:'#C46A9C'}},cat:{id:'cat',label:'Cat',palette:{fur:'#D3915E',inner:'#F3C7A2'}},robot:{id:'robot',label:'Robot',palette:{metal:'#91A6BC',accent:'#4386D6'}}});
export const CLIP_PRESETS=Object.freeze({idle:{duration:3,loop:true},walk:{duration:1.6,loop:true},run:{duration:1,loop:true},wave:{duration:1.2,loop:false},jump:{duration:.9,loop:false},dance:{duration:2,loop:true},nod:{duration:1,loop:false},turn:{duration:1.5,loop:false}});
export const hasRig=id=>Boolean(RIGS[id]);
export const hasClip=id=>Boolean(CLIP_PRESETS[id]);
export function makeCharacterLayer(overrides={}){return{id:'character',name:'Character',type:'character',rig:'starter-boy',x:.5,y:.58,scale:.72,facing:'right',clips:[{clip:'idle',t:0,...CLIP_PRESETS.idle}],...overrides}}
