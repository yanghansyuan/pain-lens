import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createChunkLoader,requiredChunks} from '../app/model-loading.ts';
import {DEFAULT_VISIBLE} from '../app/anatomy.ts';

const atlas=JSON.parse(fs.readFileSync(new URL('../public/models/atlas.json',import.meta.url)));
const state={visible:DEFAULT_VISIBLE,selected:[],hidden:[],isolate:false};
const first=requiredChunks(atlas,state);
assert.deepEqual(new Set(first.flatMap(i=>atlas.parts.filter(p=>p.chunk===i).map(p=>p.system))),new Set(['muscular','skeletal']));
assert.equal(first.length<atlas.chunks.length,true);
const organ=atlas.parts.find(p=>p.system==='digestive');
assert.ok(requiredChunks(atlas,{...state,selected:[organ.id]}).includes(organ.chunk));
assert.equal(requiredChunks(atlas,{...state,visible:[],selected:[organ.id]})[0],organ.chunk);
assert.deepEqual(requiredChunks(atlas,{...state,visible:[],selected:[organ.id],hidden:[organ.id]}),[]);
assert.deepEqual(requiredChunks(atlas,{...state,isolate:true,selected:[organ.id]}),[organ.chunk]);
assert.deepEqual(requiredChunks(atlas,{...state,visible:[]}),[]);
for(let i=0;i<atlas.chunks.length;i++){
 const chunk=atlas.chunks[i];
 assert.equal(new Set(atlas.parts.filter(p=>p.chunk===i).map(p=>p.system)).size,1);
 const bytes=fs.readFileSync(new URL('../public'+chunk.url,import.meta.url));
 const gzip=fs.readFileSync(new URL('../public'+chunk.gzip,import.meta.url));
 assert.equal(bytes.length,chunk.bytes);assert.equal(gzip.length,chunk.gzipBytes);assert.ok(gunzipSync(gzip).equals(bytes));
}

const tick=()=>new Promise(resolve=>setImmediate(resolve));
const started=[],pending=new Map();let status;
const loader=createChunkLoader(i=>{started.push(i);return new Promise((resolve,reject)=>pending.set(i,{resolve,reject}));},s=>status=s,2);
loader.request([0,1,2]);await tick();assert.deepEqual(started,[0,1]);
loader.request([3,1]);pending.get(0).resolve();await tick();assert.deepEqual(started,[0,1,3]);
pending.get(1).resolve();pending.get(3).reject(new Error('offline'));await tick();assert.deepEqual(status.failed,[3]);
loader.request([1,3]);await tick();assert.deepEqual(started,[0,1,3]);
loader.retry();await tick();assert.deepEqual(started,[0,1,3,3]);pending.get(3).resolve();await tick();assert.deepEqual(status.failed,[]);
loader.request([3,1]);await tick();assert.equal(started.length,4);
loader.request([4,5,6]);await tick();const snapshot=status;loader.dispose();pending.get(4).resolve();pending.get(5).resolve();await tick();assert.equal(status,snapshot);assert.ok(!started.includes(6));
const initialBytes=first.reduce((n,i)=>n+atlas.chunks[i].gzipBytes,0),allBytes=atlas.chunks.reduce((n,c)=>n+c.gzipBytes,0);
console.log(JSON.stringify({meshes:atlas.parts.length,initialChunks:first.length,totalChunks:atlas.chunks.length,initialBytes,allBytes,reductionPercent:Math.round((1-initialBytes/allBytes)*100)}));
console.log('Layer boundaries, gzip integrity, selection priority, hidden/isolate filtering, concurrency, queue replacement, cache reuse, retry, and disposal passed.');
