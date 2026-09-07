import {flushSync} from 'react-dom';
import {registerAtlasTools} from './agent-tools';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Activity,ArrowUpRight,ChevronRight,Crosshair,EyeOff,Focus,Info,Layers3,Pause,RotateCcw,RotateCw,Search,Video,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {Sheet,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
import {Combobox,ComboboxInput,ComboboxContent,ComboboxList,ComboboxItem,ComboboxEmpty} from '@/components/ui/combobox';
import AnatomyScene from './scene';
import {DEFAULT_VISIBLE,SYSTEMS,EXPLANATIONS,explanation,type Atlas,type Concept,type SceneState,type SystemId,type View} from './anatomy';
const initial:SceneState={explode:0,visible:DEFAULT_VISIBLE,selected:[],hidden:[],isolate:false,view:'three-quarter',rotate:false,reset:0,highlight:0};
const localAsset=(url:string)=>url.startsWith('/')?`.${url}`:url;
const normalizeAtlas=(atlas:Atlas):Atlas=>({...atlas,chunks:atlas.chunks.map(chunk=>({...chunk,url:localAsset(chunk.url),gzip:chunk.gzip?localAsset(chunk.gzip):chunk.gzip}))});
const TERMS:Record<string,string>={
 'left':'左側','right':'右側','anterior':'前側','posterior':'後側','superior':'上部','inferior':'下部','upper':'上部','lower':'下部','middle':'中段','medial':'內側','lateral':'外側','deep':'深層','superficial':'表層',
 'muscle':'肌','tendon':'肌腱','ligament':'韌帶','bone':'骨','joint':'關節','nerve':'神經','artery':'動脈','vein':'靜脈','fascia':'筋膜','cartilage':'軟骨',
 'lumbar':'腰椎','thoracic':'胸椎','cervical':'頸椎','sacral':'薦椎','coccygeal':'尾椎','vertebra':'椎骨','vertebrae':'椎骨','spine':'脊柱','pelvis':'骨盆','ilium':'髂骨','ischium':'坐骨','pubis':'恥骨',
 'gluteus maximus':'臀大肌','gluteus medius':'臀中肌','gluteus minimus':'臀小肌','piriformis':'梨狀肌','iliopsoas':'髂腰肌','psoas major':'腰大肌','iliacus':'髂肌','quadratus lumborum':'腰方肌',
 'erector spinae':'豎脊肌','iliocostalis lumborum':'腰髂肋肌','longissimus thoracis':'胸最長肌','multifidus':'多裂肌','latissimus dorsi':'闊背肌','sacroiliac':'薦髂',
 'femur':'股骨','sacrum':'薦骨','coccyx':'尾骨','acetabulum':'髖臼','hip':'髖','thigh':'大腿','hamstring':'腿後肌','biceps femoris':'股二頭肌','semitendinosus':'半腱肌','semimembranosus':'半膜肌',
 'rectus abdominis':'腹直肌','external oblique':'腹外斜肌','internal oblique':'腹內斜肌','transversus abdominis':'腹橫肌',
 'heart':'心臟','brain':'腦','liver':'肝臟','stomach':'胃','spleen':'脾臟','pancreas':'胰臟','kidney':'腎臟','urinary bladder':'膀胱','trachea':'氣管','lung':'肺','colon':'結腸','small intestine':'小腸'
};
const TIPS:Record<string,{zh:string;keywords:string[]}> = {
 'piriformis':{zh:'梨狀肌',keywords:['piriformis stretch','piriformis syndrome physical therapy','梨狀肌 伸展 復健']},
 'gluteus medius':{zh:'臀中肌',keywords:['gluteus medius strengthening physical therapy','clamshell exercise glute medius','臀中肌 訓練 復健']},
 'gluteus maximus':{zh:'臀大肌',keywords:['glute bridge physical therapy','gluteus maximus strengthening','臀大肌 臀橋 復健']},
 'gluteus minimus':{zh:'臀小肌',keywords:['gluteus minimus physical therapy','hip abductor strengthening physical therapy','臀小肌 髖外展 復健']},
 'quadratus femoris':{zh:'股方肌',keywords:['deep hip external rotator stretch physical therapy','quadratus femoris stretch','深層髖外旋肌 伸展']},
 'iliocostalis lumborum':{zh:'腰髂肋肌',keywords:['erector spinae low back physical therapy','iliocostalis lumborum exercise','下背 豎脊肌 復健']},
 'longissimus thoracis':{zh:'胸最長肌',keywords:['thoracic erector spinae mobility physical therapy','back extensor exercise physical therapy','豎脊肌 活動度 復健']},
 'biceps femoris':{zh:'股二頭肌',keywords:['hamstring rehab exercise physical therapy','biceps femoris stretch strengthening','腿後肌 復健']},
 'semitendinosus':{zh:'半腱肌',keywords:['hamstring mobility physical therapy','semitendinosus rehab exercise','腿後肌 伸展 復健']},
 'semimembranosus':{zh:'半膜肌',keywords:['hamstring strengthening physical therapy','semimembranosus rehab exercise','腿後肌 強化 復健']},
 'sacrum':{zh:'薦骨',keywords:['sacroiliac joint pain exercises physical therapy','SI joint stabilization exercises','薦髂關節 復健 運動']},
 'femur':{zh:'股骨',keywords:['hip mobility physical therapy','hip strengthening physical therapy','髖關節 活動度 復健']},
};
const SEARCH_ALIASES:Record<string,string[]>={
 '梨狀肌':['piriformis'],'臀中肌':['gluteus medius'],'臀大肌':['gluteus maximus'],'臀小肌':['gluteus minimus'],'股方肌':['quadratus femoris'],'腰方肌':['quadratus lumborum'],
 '腰大肌':['psoas major'],'髂腰肌':['iliopsoas'],'髂肌':['iliacus'],'豎脊肌':['iliocostalis lumborum','longissimus thoracis'],'腰髂肋肌':['iliocostalis lumborum'],'胸最長肌':['longissimus thoracis'],
 '股二頭肌':['biceps femoris'],'半腱肌':['semitendinosus'],'半膜肌':['semimembranosus'],'腹直肌':['rectus abdominis'],'腹外斜肌':['external oblique'],'腹內斜肌':['internal oblique'],'腹橫肌':['transversus abdominis'],
 '髖':['hip','gluteus','psoas','piriformis'],'屁股':['gluteus','piriformis'],'臀':['gluteus','piriformis'],'下背':['iliocostalis lumborum','longissimus thoracis','quadratus lumborum','psoas'],'腰':['iliocostalis lumborum','longissimus thoracis','quadratus lumborum','psoas']
};
const muscleSeeds=['piriformis','gluteus medius','gluteus maximus','gluteus minimus','psoas major','iliacus','quadratus femoris','iliocostalis lumborum','longissimus thoracis','biceps femoris','semitendinosus','semimembranosus','rectus abdominis','external oblique','internal oblique','transversus abdominis'];
const VIDEO_PREVIEWS=[
 {match:['piriformis','梨狀肌','sciatica'],title:'梨狀肌/坐骨神經伸展示範',id:'4UoITjubrgE',caption:'適合先看動作方向，再依自身狀況保守嘗試。'},
 {match:['gluteus','臀','hip','髖','psoas','iliacus','quadratus femoris'],title:'髖部伸展與強化示範',id:'tQNk6mpFsww',caption:'可用來理解臀部、髖屈肌與髖周邊動作。'},
 {match:['lumbar','back','腰','下背','sacrum','薦'],title:'下背/臀部疼痛常見伸展',id:'4UoITjubrgE',caption:'偏向下背連到臀部時，可先看溫和伸展類型。'}
];
function localName(name:string){
 const lower=name.toLowerCase();
 const hit=Object.entries(TIPS).find(([key])=>lower.includes(key));
 const terms=Object.entries(TERMS).sort((a,b)=>b[0].length-a[0].length);
 const translated=terms.reduce((text,[en,zh])=>text.replace(new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'gi'),zh),name.replace(/\s+/g,' ').trim());
 if(!hit)return translated;
 return translated.replace(new RegExp(hit[0],'i'),hit[1].zh);
}
function videoSearches(name:string){
 const lower=name.toLowerCase();
 const hit=Object.entries(TIPS).find(([key])=>lower.includes(key));
 const keywords=hit?.[1].keywords ?? [`${name} physical therapy exercise`,`${name} stretch strengthening`,'物理治療 復健 運動'];
 return keywords.map(label=>({label,url:`https://www.youtube.com/results?search_query=${encodeURIComponent(label)}`}));
}
function videoPreviews(name:string){
 const text=`${name} ${localName(name)}`.toLowerCase();
 const matches=VIDEO_PREVIEWS.filter(v=>v.match.some(term=>text.includes(term.toLowerCase())));
 return (matches.length?matches:VIDEO_PREVIEWS.slice(1,2)).slice(0,2);
}
function searchTerms(query:string){
 const term=query.toLowerCase().trim(),aliases=Object.entries(SEARCH_ALIASES).filter(([zh])=>query.includes(zh)).flatMap(([,en])=>en);
 return Array.from(new Set([term,...aliases.map(x=>x.toLowerCase())].filter(Boolean)));
}
function searchableText(c:Concept){return [c.id,c.name,localName(c.name)].join(' ').toLowerCase();}
export default function Home(){
 const detailTitle=useRef<HTMLHeadingElement>(null);
 const [atlas,setAtlas]=useState<Atlas|null>(null),[state,setState]=useState(initial),[progress,setProgress]=useState(0),[error,setError]=useState(''),[panel,setPanel]=useState<'layers'|'search'|null>(null),[details,setDetails]=useState(false),[about,setAbout]=useState(false),[query,setQuery]=useState(''),[chosen,setChosen]=useState<Concept|null>(null),[largeVideo,setLargeVideo]=useState<(typeof VIDEO_PREVIEWS)[number]|null>(null);
 useEffect(()=>{const abort=new AbortController();setProgress(0);setError('');setAtlas(null);setChosen(null);setDetails(false);setState({...initial,visible:DEFAULT_VISIBLE});fetch('./models/atlas.json',{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error('The anatomy catalogue could not be loaded.');return r.json();}).then(data=>setAtlas(normalizeAtlas(data as Atlas))).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>abort.abort();},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='/'&&!(e.target instanceof HTMLInputElement)&&!(e.target instanceof HTMLTextAreaElement)){e.preventDefault();setPanel('search');setDetails(false);}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 const parts=useMemo(()=>new Map(atlas?.parts.map(p=>[p.id,p])),[atlas]);
 const counts=useMemo(()=>Object.fromEntries(SYSTEMS.map(s=>[s.id,atlas?.parts.filter(p=>p.system===s.id).length??0])),[atlas]);
 const activeSystems=SYSTEMS.filter(s=>counts[s.id]>0);
 const selectedParts=state.selected.map(id=>parts.get(id)).filter(p=>!!p),selected=selectedParts[0],system=SYSTEMS.find(s=>s.id===selected?.system);
 const hiddenParts=state.hidden.map(id=>parts.get(id)).filter(p=>!!p);
 const visibleCount=atlas?.parts.filter(p=>!state.hidden.includes(p.id)&&(state.isolate?state.selected.includes(p.id):state.visible.includes(p.system)||state.selected.includes(p.id))).length??0;
 const results=useMemo(()=>{if(!atlas)return[];const fromPart=(p:Atlas['parts'][number]):Concept=>({id:`part:${p.id}`,name:p.name,elements:[p.id]});const pool=[...atlas.concepts,...atlas.parts.filter(p=>p.system==='muscular').map(fromPart)],seen=new Set<string>();const unique=pool.filter(c=>{const key=c.elements.join(',')||c.id;if(seen.has(key))return false;seen.add(key);return true;});const terms=searchTerms(query);if(!terms.length)return muscleSeeds.flatMap(seed=>unique.filter(c=>searchableText(c).includes(seed))).slice(0,80);return unique.filter(c=>{const text=searchableText(c);return terms.some(term=>text.includes(term));}).sort((a,b)=>{const am=a.elements.some(id=>parts.get(id)?.system==='muscular')?0:1,bm=b.elements.some(id=>parts.get(id)?.system==='muscular')?0:1;return am-bm||a.name.length-b.name.length;}).slice(0,100);},[atlas,parts,query]);
 const choose=(c:Concept)=>{setChosen(c);setState(s=>({...s,selected:c.elements,isolate:false,rotate:false}));setDetails(true);setPanel(null);};
 useEffect(()=>{if(!atlas)return;return registerAtlasTools(atlas,c=>flushSync(()=>choose(c)));},[atlas]);
 const choosePart=(id:string)=>{const p=parts.get(id);if(!p)return;setChosen({id:p.conceptId,name:p.name,elements:[id]});setState(s=>({...s,selected:[id],isolate:false,rotate:false}));setDetails(true);setPanel(null);};
 const toggle=(id:SystemId)=>{setDetails(false);setState(s=>({...s,selected:[],isolate:false,visible:s.visible.includes(id)?s.visible.filter(x=>x!==id):[...s.visible,id]}));};
 const reset=()=>{setState(s=>({...initial,visible:DEFAULT_VISIBLE,hidden:[],reset:s.reset+1}));setChosen(null);setDetails(false);setPanel(null);};
 const hideSelected=()=>{setState(s=>({...s,hidden:Array.from(new Set([...s.hidden,...s.selected])),selected:[],isolate:false}));setChosen(null);setDetails(false);};
 const restoreHidden=()=>setState(s=>({...s,hidden:[],reset:s.reset+1}));
 const restoreOne=(id:string)=>setState(s=>({...s,hidden:s.hidden.filter(x=>x!==id),reset:s.reset+1}));
 const highlightSelected=()=>setState(s=>({...s,isolate:false,rotate:false,highlight:s.highlight+1}));
 const openPanel=(next:'layers'|'search')=>{setDetails(false);setPanel(p=>p===next?null:next);};
 return <main className="studio">
  {atlas&&<AnatomyScene atlas={atlas} state={{...state,inspectorOpen:details&&selectedParts.length>0}} onSelect={choosePart} onProgress={n=>{setProgress(n);if(n===100)setError('');}} onError={setError}/>}
  <div className="vignette"/>
  <header className="identity"><div className="eyebrow"><span className="status-dot"/> 互動式解剖模型</div><h1>Pain Lens<Badge variant="outline" className="edition">疼痛透視鏡</Badge></h1><div className="identity-meta">{atlas?atlas.parts.length.toLocaleString():'2,234'} 個可選部位 <span>·</span> BodyParts3D</div></header>
  <nav className="top-actions" aria-label="探索面板">{state.hidden.length>0&&<Button variant="ghost" className={panel==='layers'?'active':''} onClick={()=>openPanel('layers')} aria-label="查看已隱藏部位"><EyeOff size={18}/><span>已隱藏 {state.hidden.length}</span></Button>}<Button variant="ghost" className={panel==='search'?'active':''} onClick={()=>openPanel('search')} aria-label="搜尋解剖部位"><Search size={18}/><span>搜尋部位</span><kbd>/</kbd></Button><Button variant="ghost" className="icon-button" aria-label="關於此模型" onClick={()=>{setDetails(false);setPanel(null);setAbout(true);}}><Info size={18}/></Button></nav>
  <section className={`layers-panel glass ${panel==='layers'?'mobile-open':''}`} aria-label="解剖系統圖層">
   <div className="panel-heading"><span>系統圖層</span><Button variant="ghost" className="mobile-only icon-button" onClick={()=>setPanel(null)} aria-label="關閉系統圖層"><X size={18}/></Button><Badge variant="secondary" className="desktop-only small-number">{activeSystems.length}</Badge></div>
   <div className="layer-presets"><Button variant="ghost" aria-pressed={activeSystems.every(x=>state.visible.includes(x.id))} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:activeSystems.map(x=>x.id)}))}>全部</Button><Button variant="ghost" aria-pressed={state.visible.length===1&&state.visible[0]==='skeletal'} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:['skeletal']}))}>骨骼</Button><Button variant="ghost" aria-pressed={state.visible.length===1&&state.visible[0]==='muscular'} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:['muscular']}))}>肌肉</Button></div>
   <div className="system-list">{activeSystems.map(s=><div className={`system-row ${state.visible.includes(s.id)?'enabled':''}`} key={s.id}><Button variant="ghost" className="system-name" title={`只顯示${s.name}`} onClick={()=>setState(v=>({...v,visible:[s.id],isolate:false,selected:[]}))}><span className="system-dot" style={{background:s.color}}/>{s.name}<span className="system-count">{counts[s.id]}</span></Button><Switch checked={state.visible.includes(s.id)} onCheckedChange={()=>toggle(s.id)} aria-label={`顯示${s.name}`} /></div>)}</div>
   <div className="panel-foot"><span>{visibleCount.toLocaleString()} 個部位可見</span><Button variant="ghost" onClick={()=>setState(s=>({...s,visible:[],selected:[],isolate:false}))}>全部隱藏</Button></div>
   {hiddenParts.length>0&&<div className="hidden-list" aria-label="已隱藏部位"><div className="hidden-list-head"><span>已隱藏部位</span><Button variant="ghost" onClick={restoreHidden}>全部恢復</Button></div>{hiddenParts.map(p=><div className="hidden-row" key={p.id}><button type="button" title={p.name} onClick={()=>choosePart(p.id)}><span>{localName(p.name)}</span><small>{SYSTEMS.find(s=>s.id===p.system)?.name}</small></button><Button variant="ghost" onClick={()=>restoreOne(p.id)}>恢復</Button></div>)}</div>}
  </section>
  {panel==='search'&&<section className="search-panel glass" aria-label="搜尋解剖部位"><div className="panel-heading"><span>搜尋肌肉/部位</span><Button variant="ghost" className="icon-button" onClick={()=>setPanel(null)} aria-label="關閉搜尋"><X size={18}/></Button></div><Combobox<Concept> items={results} value={null} onValueChange={value=>{if(value)choose(value);}} inputValue={query} onInputValueChange={setQuery} itemToStringLabel={c=>localName(c.name)} filter={null} open onOpenChange={open=>{if(!open)setPanel(null);}}><ComboboxInput autoFocus placeholder="梨狀肌、臀中肌、下背、piriformis…" aria-label="搜尋肌肉或解剖結構名稱" showTrigger={false}/><ComboboxContent className="anatomy-search-results"><ComboboxEmpty>找不到符合的部位。</ComboboxEmpty><ComboboxList>{(c:Concept)=><ComboboxItem key={c.id} value={c}><span className="search-result-name">{localName(c.name)}</span><span className="small-number">{c.elements.length} 個 mesh</span></ComboboxItem>}</ComboboxList></ComboboxContent></Combobox><p className="search-note">{query?'可用繁中或英文搜尋；搜尋「腰」「下背」「臀」會帶出相關肌肉。':'預設先顯示常見肌肉；也可搜尋 piriformis、gluteus medius、psoas major。'}</p></section>}
  <nav className="view-controls glass" aria-label="視角控制">{(['three-quarter','front','side','back'] as View[]).map((v,i)=><Button variant="ghost" key={v} className={state.view===v?'active':''} aria-pressed={state.view===v} onClick={()=>setState(s=>({...s,view:v,reset:s.reset+1,rotate:false}))} title={['斜側視角','正面','側面','背面'][i]} aria-label={['斜側視角','正面視角','側面視角','背面視角'][i]}><span>{['¾','F','S','B'][i]}</span></Button>)}<i/><Button variant="ghost" disabled={state.explode>=.4} aria-label={state.rotate?'暫停旋轉':'自動旋轉'} title="自動旋轉" className={state.rotate?'active':''} onClick={()=>setState(s=>({...s,rotate:!s.rotate}))}>{state.rotate?<Pause size={17}/>:<RotateCw size={18}/>}</Button><Button variant="ghost" aria-label="重設視角與圖層" title="重設" onClick={reset}><RotateCcw size={17}/></Button></nav>
  <div className="scene-caption"><span className="caption-line"/><span>{state.isolate?(chosen?localName(chosen.name):'已選取部位'):state.explode>.95?'解剖部件展開':state.explode>.05?'分離檢視':'成人男性參考模型'}</span><span className="caption-line"/></div>
  <div className="bottom-dock glass"><Button variant="ghost" className="mobile-only dock-layers" onClick={()=>openPanel('layers')} aria-label="開啟系統圖層"><Layers3 size={20}/><span>圖層</span></Button><div className="explode-control"><div className="explode-label"><label id="explode-label">拆解模型</label><output>{Math.round(state.explode*100)}<span>%</span></output></div><Slider aria-labelledby="explode-label" min={0} max={100} step={1} value={[state.explode*100]} onValueChange={v=>setState(s=>({...s,explode:(Array.isArray(v)?v[0]:v)/100,rotate:false}))}/><div className="slider-endpoints"><span>組裝</span><span>全部拆開</span></div></div><Button variant="ghost" className="dock-reset" onClick={reset} aria-label="組裝並重設"><RotateCcw size={18}/><span>重設</span></Button></div>
  <footer className="studio-footer"><span>{state.explode>.8?'拖曳平移':'拖曳旋轉'} <b>·</b> 滾輪/捏合縮放 <b>·</b> 點選查看</span><Button variant="ghost" onClick={()=>{setDetails(false);setPanel(null);setAbout(true);}}>來源與授權 <ArrowUpRight size={12}/></Button></footer>
  {progress<100&&!error&&<div className="loading glass" role="status"><Activity size={18}/><div><strong>正在準備解剖模型</strong><span>{progress}% · 載入 {atlas?.parts.length.toLocaleString()??'2,234'} 個部位</span><div className="loading-track"><i style={{width:`${progress}%`}}/></div></div></div>}
  {error&&<div className="loading glass error" role="alert"><p>{error}</p><Button variant="ghost" onClick={()=>location.reload()}>重新載入</Button></div>}
  <Sheet open={details&&selectedParts.length>0} modal={false} disablePointerDismissal onOpenChange={setDetails}><SheetContent initialFocus={detailTitle} className={`detail-sheet glass ${state.isolate?'is-isolated':''}`} showCloseButton={true}><div className="detail-header"><div className="detail-accent" style={{background:system?.color}}/><div className="eyebrow">{system?.name??'解剖部位'}</div><SheetTitle ref={detailTitle} tabIndex={-1} className="structure-title">{chosen?localName(chosen.name):''}</SheetTitle></div><div className="detail-scroll" key={`${chosen?.id}-${state.isolate}`}><SheetDescription className="structure-description">{chosen&&selected?explanation(chosen.name,selected.system):''}</SheetDescription>{chosen&&!EXPLANATIONS[chosen.name.toLowerCase()]&&<span className="context-note">系統說明 · 來源解剖資料中的命名結構</span>}<div className="structure-meta"><span>Atlas 參考 ID<strong>{chosen?.id}</strong></span><span>選取 mesh<strong>{state.selected.length.toLocaleString()}</strong></span></div>{chosen&&<div className="video-recs"><h3><Video size={16}/> 影片預覽與延伸搜尋</h3><div className="video-preview-list">{videoPreviews(chosen.name).map(v=><div className="video-preview" key={v.id}><iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0&playsinline=1`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy"/><div className="video-preview-meta"><strong>{v.title}</strong><span>{v.caption}</span><Button variant="ghost" onClick={()=>setLargeVideo(v)}>放大觀看</Button></div></div>)}</div>{videoSearches(chosen.name).map(link=><a key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={13}/></a>)}</div>}{selectedParts.length>1&&<div className="member-list"><h3>包含的細部結構</h3>{selectedParts.slice(0,50).map(p=><Button variant="ghost" key={p.id} onClick={()=>choosePart(p.id)}><span>{localName(p.name)}</span><ChevronRight size={14}/></Button>)}{selectedParts.length>50&&<p>另有 {selectedParts.length-50} 個 mesh。</p>}</div>}<a className="source-link" href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noreferrer">查看解剖來源 <ArrowUpRight size={14}/></a></div><div className="detail-actions"><Button className="locate-action" onClick={highlightSelected}><Crosshair size={18}/>定位高亮</Button><Button className={`primary-action ${state.isolate?'active':''}`} onClick={()=>setState(s=>({...s,isolate:!s.isolate,explode:0}))}><Focus size={18}/>{state.isolate?'顯示周圍結構':'只看這個部位'}<ChevronRight size={16}/></Button><Button variant="ghost" className="secondary-action" onClick={hideSelected}><EyeOff size={17}/>隱藏這個部位</Button><Button variant="ghost" className="secondary-action" onClick={()=>{setState(s=>({...s,selected:[],isolate:false}));setDetails(false);}}>清除選取</Button></div></SheetContent></Sheet>
  {largeVideo&&<div className="video-lightbox" role="dialog" aria-modal="true" aria-label="放大觀看影片"><button className="video-lightbox-backdrop" type="button" aria-label="關閉影片" onClick={()=>setLargeVideo(null)}/><div className="video-lightbox-panel"><div className="video-lightbox-head"><strong>{largeVideo.title}</strong><Button variant="ghost" className="icon-button" onClick={()=>setLargeVideo(null)} aria-label="關閉影片"><X size={20}/></Button></div><iframe src={`https://www.youtube-nocookie.com/embed/${largeVideo.id}?rel=0&playsinline=1&autoplay=1`} title={largeVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div></div>}
  <Sheet open={about} onOpenChange={setAbout}><SheetContent className="about-sheet glass"><div className="eyebrow">來源與範圍</div><SheetTitle className="structure-title">Pain Lens 疼痛透視鏡</SheetTitle><SheetDescription>以 BodyParts3D 成人男性參考模型為基底，加入繁中介面、單獨隱藏部位與影片搜尋。</SheetDescription><div className="about-copy"><p><strong>成人男性 · BodyParts3D</strong><br/>此模型包含 2,234 個可選 mesh 與 3,432 個命名概念。</p><p>這是教育與疼痛位置溝通工具，不代表每個人的解剖差異，也不能取代醫師或物理治療師的診斷。</p><p>點選肌肉或其他部位後，系統會依名稱產生復健/鍛鍊影片搜尋關鍵字；請以低痛感、保守量開始。</p><h3>來源</h3><p>BodyParts3D, © The Database Center for Life Science，依 CC Attribution 4.0 International 授權。</p><a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noreferrer">資料集授權 <ArrowUpRight size={14}/></a><a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noreferrer">原始模型與 metadata <ArrowUpRight size={14}/></a><a href="https://github.com/ashemag/human-atlas" target="_blank" rel="noreferrer">Human Atlas 原始網站 <ArrowUpRight size={14}/></a></div></SheetContent></Sheet>
 </main>;
}

