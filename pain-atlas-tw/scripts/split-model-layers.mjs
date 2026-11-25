import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';

const dir=new URL('../public/models/',import.meta.url);
const atlas=JSON.parse(fs.readFileSync(new URL('atlas.json',dir),'utf8'));
if(atlas.chunkLayout==='system-v1'){
 console.log('Anatomy already split by system.');
 process.exit(0);
}
const source=atlas.chunks.map(c=>fs.readFileSync(new URL(c.url.split('/').pop(),dir)));
const originals=atlas.chunks.flatMap(c=>[c.url,c.gzip].filter(Boolean));
const parts=atlas.parts.map(p=>({...p})),chunks=[],outputs=[];
const maxBytes=1_000_000;
for(const system of new Set(parts.map(p=>p.system))){
 let segments=[],bytes=0;
 const flush=()=>{
  if(!bytes)return;
  const buffer=Buffer.concat(segments),gzip=gzipSync(buffer,{level:9});
  const hash=createHash('sha256').update(buffer).digest('hex').slice(0,12);
  const url=`/models/layer-${system}-${hash}.bin`;
  chunks.push({url,bytes,gzip:url+'.gz',gzipBytes:gzip.length,system});
  outputs.push({url,buffer,gzip});segments=[];bytes=0;
 };
 const append=buffer=>{
  const padding=(4-bytes%4)%4;
  if(padding){segments.push(Buffer.alloc(padding));bytes+=padding;}
  const offset=bytes;segments.push(buffer);bytes+=buffer.length;return offset;
 };
 // Place torso structures first so common pain locations appear early.
 const group=parts.filter(p=>p.system===system).sort((a,b)=>{
  const distance=p=>Math.abs((p.bounds[0][1]+p.bounds[1][1])/2-1.05);
  return distance(a)-distance(b);
 });
 for(const p of group){
  const input=source[p.chunk],size=p.vertexCount*18+p.indexCount*4+12;
  if(bytes&&bytes+size>maxBytes)flush();
  const position=input.subarray(p.positions,p.positions+p.vertexCount*12);
  const normal=input.subarray(p.normals,p.normals+p.vertexCount*6);
  const index=input.subarray(p.indices,p.indices+p.indexCount*4);
  p.chunk=chunks.length;p.positions=append(position);p.normals=append(normal);p.indices=append(index);
 }
 flush();
}
// Validate every byte against its original mesh before replacing the manifest.
for(let i=0;i<parts.length;i++){
 const before=atlas.parts[i],after=parts[i],input=source[before.chunk],output=outputs[after.chunk].buffer;
 for(const [key,length] of [['positions',before.vertexCount*12],['normals',before.vertexCount*6],['indices',before.indexCount*4]]){
  assert.equal(after[key]%4,0);
  assert.ok(input.subarray(before[key],before[key]+length).equals(output.subarray(after[key],after[key]+length)),`${before.id}: ${key} changed`);
 }
}
for(const output of outputs){
 assert.ok(gunzipSync(output.gzip).equals(output.buffer));
 fs.writeFileSync(new URL(output.url.split('/').pop(),dir),output.buffer);
 fs.writeFileSync(new URL(output.url.split('/').pop()+'.gz',dir),output.gzip);
}
const previousBytes=atlas.chunks.reduce((n,c)=>n+c.gzipBytes,0);
atlas.parts=parts;atlas.chunks=chunks;atlas.chunkLayout='system-v1';
fs.writeFileSync(new URL('atlas.json',dir),JSON.stringify(atlas));
for(const url of originals){
 const file=new URL(url.split('/').pop(),dir);
 assert.ok(file.href.startsWith(dir.href));
 fs.unlinkSync(file);
}
const initial=chunks.filter(c=>['muscular','skeletal'].includes(c.system));
console.log(JSON.stringify({meshes:parts.length,chunks:chunks.length,previousGzipBytes:previousBytes,initialGzipBytes:initial.reduce((n,c)=>n+c.gzipBytes,0),allGzipBytes:chunks.reduce((n,c)=>n+c.gzipBytes,0)}));
