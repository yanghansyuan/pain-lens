export type SystemId = 'skeletal'|'muscular'|'arterial'|'venous'|'nervous'|'digestive'|'respiratory'|'urinary'|'reproductive'|'lymphatic'|'endocrine'|'integumentary'|'connective'|'sensory'|'cardiac';
export const SYSTEMS: {id:SystemId;name:string;color:string;description:string}[] = [
 {id:'skeletal',name:'骨骼',color:'#e2d9ba',description:'骨骼支撐身體、保護器官，並提供肌肉附著點。'},
 {id:'muscular',name:'肌肉',color:'#a85b50',description:'骨骼肌透過收縮拉動附著點，負責關節動作、姿勢穩定與力量輸出。'},
 {id:'cardiac',name:'心臟',color:'#b96760',description:'心臟是胸腔內的肌肉幫浦，推動血液通過肺循環與體循環。'},
 {id:'sensory',name:'感覺器官',color:'#b0c8ce',description:'感覺器官負責視覺、聽覺、平衡等特殊感覺。'},
 {id:'arterial',name:'動脈',color:'#c05245',description:'動脈將血液由心臟送往身體組織。'},
 {id:'venous',name:'靜脈',color:'#527c9f',description:'靜脈將血液由周邊組織帶回心臟。'},
 {id:'nervous',name:'神經系統',color:'#d8b565',description:'神經系統傳遞與處理訊號，支援感覺、動作、協調與自律調節。'},
 {id:'respiratory',name:'呼吸系統',color:'#b98991',description:'呼吸道與肺部負責氣體交換，呼吸動作依賴胸腔壓力變化。'},
 {id:'digestive',name:'消化系統',color:'#b8916b',description:'消化系統分解食物、吸收營養與水分，並推進廢物。'},
 {id:'urinary',name:'泌尿系統',color:'#b47961',description:'腎臟調節水分、電解質與酸鹼平衡，尿液經輸尿管進入膀胱。'},
 {id:'lymphatic',name:'淋巴系統',color:'#879f7c',description:'淋巴系統回收組織液，並參與免疫監控。'},
 {id:'endocrine',name:'內分泌',color:'#c5a09a',description:'內分泌器官釋放荷爾蒙，協調代謝、生長、壓力與生殖相關功能。'},
 {id:'reproductive',name:'生殖系統',color:'#bda098',description:'此模型包含男性生殖相關結構。'},
 {id:'integumentary',name:'身體表面',color:'#ba9b7d',description:'身體表面提供外型參考，可用來對照深層肌肉與器官位置。'},
 {id:'connective',name:'結締組織',color:'#aec3bb',description:'軟骨、韌帶與其他結締組織支撐、連接並分隔身體結構。'},
];
export interface Part {id:string;name:string;conceptId:string;system:SystemId;chunk:number;positions:number;normals:number;indices:number;vertexCount:number;indexCount:number;bounds:[number[],number[]]}
export interface Concept {id:string;name:string;elements:string[]}
export interface Atlas {version:string;sex?:'male';source?:string;scope?:string;parts:Part[];concepts:Concept[];chunks:{url:string;bytes:number;gzip?:string;gzipBytes?:number}[];triangles:number}
export type View = 'three-quarter'|'front'|'back'|'side';
export interface SceneState {inspectorOpen?:boolean;explode:number;visible:SystemId[];selected:string[];hidden:string[];isolate:boolean;view:View;rotate:boolean;reset:number;highlight:number}
export const DEFAULT_VISIBLE:SystemId[] = ['cardiac','sensory','skeletal','muscular','arterial','venous','nervous','respiratory','digestive','urinary','lymphatic','endocrine','reproductive','connective'];
export const EXPLANATIONS:Record<string,string> = {
 'heart':'胸腔內的肌肉幫浦，負責推動血液循環。',
 'liver':'位於右上腹的大型器官，負責代謝、膽汁生成與多種蛋白合成。',
 'brain':'神經系統的中樞，支援感覺、動作、記憶、語言與身體調節。',
 'stomach':'位於食道與小腸之間的肌肉囊袋，負責暫存與攪拌食物。',
 'spleen':'左上腹的淋巴器官，參與血液過濾與免疫反應。',
 'pancreas':'兼具消化與內分泌功能的腹部器官。',
 'urinary bladder':'骨盆內儲存尿液的肌肉囊袋。',
 'trachea':'連接喉部與支氣管的主要呼吸道。',
 'diaphragm':'分隔胸腔與腹腔的大型呼吸肌。',
};
export function explanation(name:string,system:SystemId){return EXPLANATIONS[name.toLowerCase()] ?? SYSTEMS.find(s=>s.id===system)?.description ?? '';}
