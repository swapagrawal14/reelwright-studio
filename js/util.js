export const uid = (prefix = 'rw') => `${prefix}_${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (name = 'inOut', t = 0) => {
  t = clamp(t, 0, 1);
  const bezier = typeof name === 'string' ? name.match(/^cubic-bezier\(\s*([-+.\d]+)\s*,\s*([-+.\d]+)\s*,\s*([-+.\d]+)\s*,\s*([-+.\d]+)\s*\)$/i) : null;
  const values = Array.isArray(name) ? name : bezier ? bezier.slice(1).map(Number) : null;
  if (values?.length === 4) {
    const [x1,y1,x2,y2]=values; let lo=0,hi=1,u=t;
    for(let i=0;i<18;i++){u=(lo+hi)/2;const x=3*(1-u)**2*u*x1+3*(1-u)*u*u*x2+u**3;if(x<t)lo=u;else hi=u}
    return 3*(1-u)**2*u*y1+3*(1-u)*u*u*y2+u**3;
  }
  if (name === 'ease-in' || name === 'easeIn') name = 'in';
  if (name === 'ease-out' || name === 'easeOut') name = 'out';
  if (name === 'ease-in-out') name = 'inOut';
  if (name === 'linear') return t;
  if (name === 'in') return t * t;
  if (name === 'out') return 1 - (1 - t) ** 2;
  if (name === 'back') return 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
  if (name === 'elastic') return t === 0 || t === 1 ? t : 2 ** (-10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1;
  if (name === 'spring') return 1 - Math.cos(t * Math.PI * 2) * Math.exp(-6 * t);
  return t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
};
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const escapeXml = value => escapeHtml(value);
export const seeded = seed => { let x = (Number(seed) || 1) >>> 0; return () => { x += 0x6D2B79F5; let t = x; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
export function downloadBlob(blob, filename) { const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500); }
export function toast(message, type = 'info') { let host=document.querySelector('#toastHost'); if(!host){host=document.createElement('div');host.id='toastHost';host.setAttribute('role','status');host.setAttribute('aria-live','polite');document.body.append(host)} const item=document.createElement('div');item.className=`toast ${type}`;item.textContent=message;host.append(item);setTimeout(()=>item.remove(),5000); }
export function createEventBus(){const events=new Map();return{on(name,fn){if(!events.has(name))events.set(name,new Set());events.get(name).add(fn);return()=>events.get(name)?.delete(fn)},emit(name,payload){events.get(name)?.forEach(fn=>fn(payload))}}}

export const isEasing = name => {
  if(Array.isArray(name))return name.length===4&&name.every(Number.isFinite)&&name[0]>=0&&name[0]<=1&&name[2]>=0&&name[2]<=1;
  if(typeof name!=='string')return false;
  if(['linear','in','out','inOut','ease-in','ease-out','ease-in-out','easeIn','easeOut','back','elastic','spring'].includes(name))return true;
  const m=name.match(/^cubic-bezier\(\s*([-+.\d]+)\s*,\s*([-+.\d]+)\s*,\s*([-+.\d]+)\s*,\s*([-+.\d]+)\s*\)$/i);
  return Boolean(m&&Number(m[1])>=0&&Number(m[1])<=1&&Number(m[3])>=0&&Number(m[3])<=1);
};
