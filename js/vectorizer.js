const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const colorHex=c=>`#${c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')}`;

function paletteFromPixels(data,w,h,count){
  const hist=new Map();
  for(let i=0;i<w*h;i++){const p=i*4;if(data[p+3]<16)continue;const r=data[p],g=data[p+1],b=data[p+2],key=(r>>3)<<10|(g>>3)<<5|(b>>3);let v=hist.get(key);if(!v)hist.set(key,v={r:0,g:0,b:0,n:0});v.r+=r;v.g+=g;v.b+=b;v.n++}
  let boxes=hist.size?[[...hist.values()]]:[];
  while(boxes.length<count){let best=-1,score=-1,channel=0;for(let i=0;i<boxes.length;i++){const box=boxes[i];if(box.length<2)continue;for(let c=0;c<3;c++){const values=box.map(v=>v[['r','g','b'][c]]/v.n),range=Math.max(...values)-Math.min(...values),weight=box.reduce((a,v)=>a+v.n,0),s=range*Math.sqrt(weight);if(s>score){best=i;score=s;channel=c}}}if(best<0)break;const box=boxes.splice(best,1)[0],key=['r','g','b'][channel];box.sort((a,b)=>a[key]/a.n-b[key]/b.n);const total=box.reduce((a,v)=>a+v.n,0);let split=1,sum=box[0].n;while(split<box.length-1&&sum<total/2){sum+=box[split].n;split++}boxes.push(box.slice(0,split),box.slice(split))}
  return boxes.map(box=>{const n=box.reduce((a,v)=>a+v.n,0);return[Math.round(box.reduce((a,v)=>a+v.r,0)/n),Math.round(box.reduce((a,v)=>a+v.g,0)/n),Math.round(box.reduce((a,v)=>a+v.b,0)/n)]});
}
function quantize(data,w,h,palette){const labels=new Uint8Array(w*h),alpha=new Uint8Array(w*h);for(let i=0;i<w*h;i++){const p=i*4;alpha[i]=data[p+3];if(alpha[i]<16){labels[i]=255;continue}let best=0,dist=Infinity;for(let k=0;k<palette.length;k++){const c=palette[k],dr=data[p]-c[0],dg=data[p+1]-c[1],db=data[p+2]-c[2],d=dr*dr+dg*dg+db*db;if(d<dist){dist=d;best=k}}labels[i]=best}return{labels,alpha}}
function components(labels,alpha,w,h,minArea){const size=w*h,seen=new Uint8Array(size),dirs=[[-1,0],[1,0],[0,-1],[0,1]],comps=[];
  for(let s=0;s<size;s++){if(seen[s]||alpha[s]<16||labels[s]===255)continue;const label=labels[s],queue=[s],pixels=[];seen[s]=1;for(let qi=0;qi<queue.length;qi++){const at=queue[qi];pixels.push(at);const x=at%w,y=(at/w)|0;for(const[dx,dy]of dirs){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const ni=ny*w+nx;if(!seen[ni]&&alpha[ni]>=16&&labels[ni]===label){seen[ni]=1;queue.push(ni)}}}comps.push({label,pixels})}
  for(const comp of comps){if(comp.pixels.length>=minArea)continue;const adjacent=new Map();for(const at of comp.pixels){const x=at%w,y=(at/w)|0;for(const[dx,dy]of dirs){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const l=labels[ny*w+nx];if(l!==255&&l!==comp.label)adjacent.set(l,(adjacent.get(l)||0)+1)}}let target=comp.label,best=0;for(const[l,n]of adjacent)if(n>best){target=l;best=n}if(best)for(const at of comp.pixels)labels[at]=target;else for(const at of comp.pixels)alpha[at]=0}
  return{labels,alpha};
}
const key=(x,y)=>`${x},${y}`;
function simplifyLoop(points){let p=points;if(p.length<4)return p;let out=[];for(let i=0;i<p.length;i++){const a=p[(i+p.length-1)%p.length],b=p[i],c=p[(i+1)%p.length];if((b[0]-a[0])*(c[1]-b[1])===(b[1]-a[1])*(c[0]-b[0]))continue;out.push(b)}return out}
function traceComponent(pixels,w,h){const set=new Set(pixels),edges=new Map();const add=(x1,y1,x2,y2)=>{const k=key(x1,y1);if(!edges.has(k))edges.set(k,[]);edges.get(k).push([x2,y2])};for(const at of pixels){const x=at%w,y=(at/w)|0;if(y===0||!set.has(at-w))add(x,y,x+1,y);if(x===w-1||!set.has(at+1))add(x+1,y,x+1,y+1);if(y===h-1||!set.has(at+w))add(x+1,y+1,x,y+1);if(x===0||!set.has(at-1))add(x,y+1,x,y)}
 const loops=[];while(edges.size){const start=edges.keys().next().value,parts=start.split(',').map(Number),points=[parts];let current=parts,guard=0;while(guard++<pixels.length*8+32){const k=key(...current),ends=edges.get(k);if(!ends?.length)break;const next=ends.pop();if(!ends.length)edges.delete(k);current=next;if(current[0]===parts[0]&&current[1]===parts[1])break;points.push(current)}if(points.length>=3)loops.push(simplifyLoop(points))}
 return loops.map(loop=>`M${loop.map(([x,y])=>`${x} ${y}`).join('L')}Z`).join('');}

/** Convert flat-color ImageData to clean filled SVG path regions. No filters or outlines are added. */
export function vectorizeImageData(imageData,{colors=12,minRegion=5,maxRegions=1200}={}){
  const w=Number(imageData?.width),h=Number(imageData?.height),data=imageData?.data;if(!Number.isInteger(w)||!Number.isInteger(h)||!data||data.length!==w*h*4)throw new Error('Vectorizer needs valid RGBA ImageData.');if(w*h>4_000_000)throw new Error('Image is too large to trace in-browser; resize it to at most 4 megapixels.');
  const palette=paletteFromPixels(data,w,h,clamp(Math.round(colors),2,32));if(!palette.length)throw new Error('The image has no visible pixels to vectorize.');let{labels,alpha}=quantize(data,w,h,palette);({labels,alpha}=components(labels,alpha,w,h,Math.max(1,Math.round(minRegion))));
  const visited=new Uint8Array(w*h),regions=[];
  for(let s=0;s<w*h;s++){const label=labels[s];if(visited[s]||alpha[s]<16||label===255)continue;const queue=[s],pixels=[];visited[s]=1;for(let qi=0;qi<queue.length;qi++){const at=queue[qi];pixels.push(at);const x=at%w,y=(at/w)|0;for(const ni of [x?at-1:-1,x<w-1?at+1:-1,y?at-w:-1,y<h-1?at+w:-1])if(ni>=0&&!visited[ni]&&alpha[ni]>=16&&labels[ni]===label){visited[ni]=1;queue.push(ni)}}if(pixels.length<minRegion)continue;let minX=w,minY=h,maxX=0,maxY=0;for(const at of pixels){const x=at%w,y=(at/w)|0;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}const d=traceComponent(pixels,w,h);if(!d)continue;regions.push({id:`region-${regions.length+1}`,name:`Color region ${regions.length+1}`,color:colorHex(palette[label]),d,area:pixels.length,bbox:{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1},pivot:{x:minX+(maxX-minX+1)/2,y:minY+(maxY-minY+1)/2}})}
  regions.sort((a,b)=>b.area-a.area);if(regions.length>maxRegions)throw new Error(`Trace produced ${regions.length} regions; raise the merge threshold or simplify the image (limit ${maxRegions}).`);
  return{viewBox:{x:0,y:0,w,h},palette:palette.map(colorHex),regions,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${regions.map(r=>`<path d="${r.d}" fill="${r.color}" fill-rule="evenodd"/>`).join('')}</svg>`};
}

export async function vectorizeImageFile(file,options={}){
  const bitmap=await createImageBitmap(file);let scale=Math.min(1,2000/Math.max(bitmap.width,bitmap.height),Math.sqrt(4_000_000/(bitmap.width*bitmap.height)));const w=Math.max(1,Math.round(bitmap.width*scale)),h=Math.max(1,Math.round(bitmap.height*scale));const canvas=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(w,h):Object.assign(document.createElement('canvas'),{width:w,height:h});const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0,w,h);bitmap.close?.();return vectorizeImageData(ctx.getImageData(0,0,w,h),options);
}

const safeSlug=s=>String(s||'part').toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'part';
/** Build data-only Reel JSON from traced regions and optional reviewed/model labels. */
export function buildVectorReel(trace,{labels=new Map(),title='Illustration'}={}){
  const getLabel=id=>labels instanceof Map?labels.get(id)||{}:labels?.[id]||{};
  const W=trace?.viewBox?.w,H=trace?.viewBox?.h;if(!(W>0&&H>0)||!Array.isArray(trace.regions)||!trace.regions.length)throw new Error('A non-empty vector trace with a positive viewBox is required.');
  const canvas={w:1080,h:1920,fps:30,bg:'#F6F7F9'},scale=Math.min(canvas.w/W,canvas.h/H),groups=new Map(),usedGroups=new Set(),usedParts=new Set();
  for(const r of trace.regions){const label=getLabel(r.id),name=String(label.name||r.name||'Part').slice(0,120),parent=String(label.parent||'character').slice(0,120),rawId=safeSlug(r.id);let id=rawId,n=2;while(usedParts.has(id))id=`${rawId}-${n++}`;usedParts.add(id);const pivot=label.pivot&&Number.isFinite(+label.pivot.x)&&Number.isFinite(+label.pivot.y)?label.pivot:r.pivot||{x:W/2,y:H/2};const part={id,name,part:name,type:'path',d:r.d,fill:r.color,stroke:'none',strokeWidth:0,fillRule:'evenodd',x:0,y:0,w:W,h:H,pivot:{x:Number(pivot.x)-W/2,y:Number(pivot.y)-H/2}};if(!groups.has(parent))groups.set(parent,[]);groups.get(parent).push(part)}
  const children=[...groups].map(([name,items])=>{const raw=safeSlug(name);let id=`group-${raw}`,n=2;while(usedGroups.has(id))id=`group-${raw}-${n++}`;usedGroups.add(id);return{id,name,type:'group',x:0,y:0,pivot:{x:0,y:0},children:items}});
  return{reelwright:1,name:`${String(title).replace(/\.[^.]+$/,'')} · editable trace`.slice(0,120),canvas,duration:6,assets:{},scenes:[{name:'Vectorized illustration',duration:6,background:{type:'color',color:canvas.bg},camera:{auto:false},layers:[{id:'vector-artwork',name:'Vector artwork',type:'vector',x:canvas.w/2,y:canvas.h/2,scale,pivot:{x:0,y:0},children}]}]};
}
