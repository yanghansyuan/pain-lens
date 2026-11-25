import type {Atlas,SceneState} from './anatomy';

export interface ModelLoadStatus {loaded:number[];requested:number[];failed:number[]}

export function requiredChunks(atlas:Atlas,state:SceneState):number[]{
 const selected=new Set(state.selected),hidden=new Set(state.hidden),visible=new Set(state.visible);
 const parts=atlas.parts.filter(p=>!hidden.has(p.id)&&(selected.has(p.id)||(!state.isolate&&visible.has(p.system))));
 const priority=new Map<number,number>();
 for(const p of parts){
  const rank=selected.has(p.id)?0:p.system==='muscular'?1:p.system==='skeletal'?2:3;
  priority.set(p.chunk,Math.min(priority.get(p.chunk)??Infinity,rank));
 }
 return [...priority.keys()].sort((a,b)=>priority.get(a)!-priority.get(b)!||a-b);
}

export function createChunkLoader(load:(index:number)=>Promise<void>,changed:(status:ModelLoadStatus)=>void,concurrency=2){
 const loaded=new Set<number>(),active=new Set<number>(),failed=new Set<number>();
 let requested:number[]=[],disposed=false;
 const report=()=>{if(!disposed)changed({loaded:[...loaded],requested:[...requested],failed:requested.filter(i=>failed.has(i))});};
 const pump=()=>{
  if(disposed)return;
  for(const index of requested){
   if(active.size>=concurrency)break;
   if(loaded.has(index)||active.has(index)||failed.has(index))continue;
   active.add(index);
   void Promise.resolve().then(()=>load(index)).then(()=>{loaded.add(index);},()=>{failed.add(index);}).finally(()=>{
    active.delete(index);
    if(!disposed){report();pump();}
   });
  }
 };
 return {
  request(indices:number[]){requested=[...new Set(indices)];report();pump();},
  retry(){for(const index of requested)failed.delete(index);report();pump();},
  hasLoaded(index:number){return loaded.has(index);},
  dispose(){disposed=true;requested=[];},
 };
}
