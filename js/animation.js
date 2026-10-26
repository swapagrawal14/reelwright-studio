import { clamp, lerp, ease, isEasing } from './util.js';

export const TRACK_PROPERTIES = new Set([
  'translateX','translateY','rotate','scale','scaleX','scaleY','opacity','width','height','size'
]);
const aliases={x:'translateX',y:'translateY',rot:'rotate',rotation:'rotate',w:'width',h:'height'};
const number=(x)=>typeof x==='number'&&Number.isFinite(x);

export function normalizeTrack(input,{path='track',duration=1,errors=[]}={}){
  if(!input||typeof input!=='object'||Array.isArray(input)){errors.push(`${path}: track must be an object.`);return null}
  const prop=aliases[input.prop]||input.prop;
  if(!TRACK_PROPERTIES.has(prop)){errors.push(`${path}: unsupported track property “${input.prop}”.`);return null}
  const mode=input.mode||'keyframes';
  if(!['keyframes','continuous','scroll'].includes(mode)){errors.push(`${path}: mode must be keyframes, continuous, or scroll.`);return null}
  const loopInput=input.loop;
  const loop=typeof loopInput==='object'&&loopInput!==null?loopInput:{};
  const period=Number(input.period??loop.period??duration);
  if(!number(period)||period<=0){errors.push(`${path}: period must be a positive number of seconds.`);return null}
  const delay=Number(input.delay||0);
  if(!number(delay)||delay<0){errors.push(`${path}: delay must be zero or a positive number of seconds.`);return null}
  const alternate=Boolean(input.alternate??input.yoyo??loop.alternate??loop.yoyo);
  const repeats=Boolean(input.repeat??(typeof loopInput==='boolean'?loopInput:loop.enabled)??(input.loop===true));
  let window=null;
  if(input.window!==undefined&&input.window!==null){
    const a=Array.isArray(input.window)?input.window[0]:input.window?.start;
    const b=Array.isArray(input.window)?input.window[1]:input.window?.end;
    if(!number(a)||!number(b)||a<0||b>1||a>=b){errors.push(`${path}: window must be a pair of cycle fractions, for example [0.62, 0.9].`);return null}
    window=[a,b];
  }
  let keys=input.keyframes??input.keys??[];
  if(!Array.isArray(keys)){errors.push(`${path}: keyframes must be an array.`);return null}
  if(mode==='keyframes'&&keys.length<1){errors.push(`${path}: keyframe track needs at least one keyframe.`);return null}
  if(keys.length>200){errors.push(`${path}: a track may contain at most 200 keyframes.`);return null}
  keys=keys.map((key,i)=>{
    const t=Number(key?.t??key?.time),v=Number(key?.value??key?.v);
    if(!number(t)||t<0||t>Math.max(duration,period)+1e-6)errors.push(`${path}: keyframe ${i+1} time must be between 0 and the scene/track period.`);
    if(!number(v))errors.push(`${path}: keyframe ${i+1} value must be a finite number.`);
    const easing=key?.easing??key?.ease??input.easing??'inOut';
    if(!isEasing(easing))errors.push(`${path}: keyframe ${i+1} has unsupported easing “${String(easing)}”.`);
    return{t:number(t)?t:0,v:number(v)?v:0,ease:isEasing(easing)?easing:'linear'}
  }).sort((a,b)=>a.t-b.t);
  for(let i=1;i<keys.length;i++)if(keys[i].t===keys[i-1].t)errors.push(`${path}: keyframe times must be unique.`);
  const speed=Number(input.speed??input.velocity??0);
  if((mode==='continuous'||mode==='scroll')&&!number(speed))errors.push(`${path}: ${mode} speed must be a finite number.`);
  const wrap=Number(input.wrap??input.wrapDistance??0);
  if(mode==='scroll'&&(!number(wrap)||wrap<0))errors.push(`${path}: scroll wrap must be zero or a positive number.`);
  return{...input,prop,mode,period,delay,alternate,repeat:repeats,window,keys,speed,wrap};
}

function cycleTime(track,time){
  let t=Math.max(0,time-(track.delay||0));
  if(track.repeat){const p=track.period||1,cycle=Math.floor(t/p),phase=t%p;t=track.alternate&&cycle%2===1?p-phase:phase}
  else if(track.alternate){const p=track.period||1,cycle=Math.floor(t/p),phase=t%p;t=cycle%2===1?p-phase:phase}
  else if(track.period&&track.mode==='keyframes')t=Math.min(t,track.period);
  if(track.window){const p=track.period||1,start=track.window[0]*p,end=track.window[1]*p;if(t<start||t>end)return null}
  return t;
}

export function evaluateTrack(track,time,base=0){
  const t=cycleTime(track,time);
  if(t===null)return base;
  if(track.mode==='continuous')return base+(track.speed||0)*t;
  if(track.mode==='scroll'){
    const start=track.keys?.[0]?.v??base;let v=start+(track.speed||0)*t;
    if(track.wrap>0)v=((v%track.wrap)+track.wrap)%track.wrap;
    return v;
  }
  const keys=track.keys||[];
  if(!keys.length)return base;
  if(t<=keys[0].t)return keys[0].v;
  if(t>=keys.at(-1).t)return keys.at(-1).v;
  for(let i=0;i<keys.length-1;i++){
    const a=keys[i],b=keys[i+1];
    if(t>=a.t&&t<=b.t){const p=ease(a.ease||'inOut',(t-a.t)/(b.t-a.t||1));return lerp(a.v,b.v,p)}
  }
  return keys.at(-1).v;
}

export const identityMatrix=()=>[1,0,0,1,0,0];
export function multiplyMatrix(a,b){return[
  a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],
  a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],
  a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]
]}
export function transformPoint(m,x,y){return{x:m[0]*x+m[2]*y+m[4],y:m[1]*x+m[3]*y+m[5]}}
export function localMatrix(layer){
  const x=Number(layer.x)||0,y=Number(layer.y)||0;
  const rotation=(Number(layer.rot??layer.rotate)||0)*Math.PI/180;
  const sx=Number(layer.scaleX??layer.scale)||1,sy=Number(layer.scaleY??layer.scale)||1;
  const pivot=Array.isArray(layer.pivot)?{x:Number(layer.pivot[0])||0,y:Number(layer.pivot[1])||0}:layer.pivot||{x:0,y:0};
  const cos=Math.cos(rotation),sin=Math.sin(rotation);
  const rs=[cos*sx,sin*sx,-sin*sy,cos*sy,0,0];
  const toPivot=[1,0,0,1,x+(Number(pivot.x)||0),y+(Number(pivot.y)||0)];
  const fromPivot=[1,0,0,1,-(Number(pivot.x)||0),-(Number(pivot.y)||0)];
  return multiplyMatrix(multiplyMatrix(toPivot,rs),fromPivot);
}
export function matrixString(m){return`matrix(${m.map(v=>Math.abs(v)<1e-12?0:Number(v.toFixed(6))).join(' ')})`}
