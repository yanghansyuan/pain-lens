// Full anatomical names take precedence over directional word substitution.
// Deep hip terminology: https://cflu.lab.nycu.edu.tw/HumDissection_Class24_CFLu.pdf
const NAMES:Record<string,string>={
 'gemellus inferior':'下孖肌','inferior gemellus':'下孖肌','gemellus superior':'上孖肌','superior gemellus':'上孖肌',
 'obturator internus':'閉孔內肌','obturator externus':'閉孔外肌','quadratus femoris':'股方肌','piriformis':'梨狀肌',
 'gluteus maximus':'臀大肌','gluteus medius':'臀中肌','gluteus minimus':'臀小肌','iliopsoas':'髂腰肌','psoas major':'腰大肌','psoas minor':'腰小肌','iliacus':'髂肌','quadratus lumborum':'腰方肌',
 'adductor brevis':'短收肌','adductor longus':'長收肌','adductor magnus':'大收肌','adductor minimus':'小收肌','gracilis':'股薄肌','pectineus':'恥骨肌','sartorius':'縫匠肌',
 'biceps femoris':'股二頭肌','semitendinosus':'半腱肌','semimembranosus':'半膜肌','quadriceps femoris':'股四頭肌','rectus femoris':'股直肌','vastus lateralis':'股外側肌','vastus medialis':'股內側肌','vastus intermedius':'股中間肌',
 'gastrocnemius':'腓腸肌','soleus':'比目魚肌','plantaris':'蹠肌','popliteus':'膕肌','tibialis anterior':'脛前肌','tibialis posterior':'脛後肌','fibularis longus':'腓骨長肌','fibularis brevis':'腓骨短肌','fibularis tertius':'第三腓骨肌','peroneus longus':'腓骨長肌','peroneus brevis':'腓骨短肌',
 'extensor digitorum longus':'趾長伸肌','extensor digitorum brevis':'趾短伸肌','extensor hallucis longus':'拇趾長伸肌','extensor hallucis brevis':'拇趾短伸肌','flexor digitorum longus':'趾長屈肌','flexor digitorum brevis':'趾短屈肌','flexor hallucis longus':'拇趾長屈肌','flexor hallucis brevis':'拇趾短屈肌','abductor hallucis':'拇趾外展肌','adductor hallucis':'拇趾內收肌','flexor accessorius':'足底方肌','quadratus plantae':'足底方肌',
 'abductor digiti minimi':'小指外展肌','flexor digiti minimi brevis':'小指短屈肌','opponens digiti minimi':'小指對掌肌','plantar interosseous':'足底骨間肌','plantar interossei':'足底骨間肌','dorsal interossei':'背側骨間肌','palmar interossei':'掌側骨間肌','lumbrical':'蚓狀肌','lumbricals':'蚓狀肌',
 'deltoid':'三角肌','supraspinatus':'棘上肌','infraspinatus':'棘下肌','teres minor':'小圓肌','teres major':'大圓肌','subscapularis':'肩胛下肌','trapezius':'斜方肌','rhomboid major':'大菱形肌','rhomboid minor':'小菱形肌','levator scapulae':'提肩胛肌','latissimus dorsi':'闊背肌',
 'pectoralis major':'胸大肌','pectoralis minor':'胸小肌','subclavius':'鎖骨下肌','serratus anterior':'前鋸肌','serratus posterior superior':'上後鋸肌','serratus posterior inferior':'下後鋸肌','external intercostal':'肋間外肌','internal intercostal':'肋間內肌','innermost intercostal':'肋間最內肌','transversus thoracis':'胸橫肌','levatores costarum breves':'肋短提肌','levatores costarum longi':'肋長提肌','diaphragm':'橫膈肌',
 'rectus abdominis':'腹直肌','external oblique':'腹外斜肌','internal oblique':'腹內斜肌','transversus abdominis':'腹橫肌','pyramidalis':'錐狀肌',
 'biceps brachii':'肱二頭肌','triceps brachii':'肱三頭肌','brachialis':'肱肌','brachioradialis':'肱橈肌','coracobrachialis':'喙肱肌','anconeus':'肘肌','pronator teres':'旋前圓肌','pronator quadratus':'旋前方肌','supinator':'旋後肌','palmaris longus':'掌長肌',
 'flexor carpi radialis':'橈側屈腕肌','flexor carpi ulnaris':'尺側屈腕肌','extensor carpi radialis longus':'橈側伸腕長肌','extensor carpi radialis brevis':'橈側伸腕短肌','extensor carpi ulnaris':'尺側伸腕肌','flexor digitorum superficialis':'屈指淺肌','flexor digitorum profundus':'屈指深肌','extensor digitorum':'伸指肌','extensor digiti minimi':'小指伸肌','extensor indicis':'食指伸肌',
 'abductor pollicis brevis':'拇短外展肌','abductor pollicis longus':'拇長外展肌','adductor pollicis':'拇收肌','opponens pollicis':'拇對掌肌','flexor pollicis brevis':'拇短屈肌','flexor pollicis longus':'拇長屈肌','extensor pollicis brevis':'拇短伸肌','extensor pollicis longus':'拇長伸肌',
 'erector spinae':'豎脊肌','iliocostalis cervicis':'頸髂肋肌','iliocostalis thoracis':'胸髂肋肌','iliocostalis lumborum':'腰髂肋肌','longissimus capitis':'頭最長肌','longissimus cervicis':'頸最長肌','longissimus thoracis':'胸最長肌','spinalis':'棘肌','spinalis thoracis':'胸棘肌','multifidus':'多裂肌','semispinalis capitis':'頭半棘肌','semispinalis cervicis':'頸半棘肌','semispinalis thoracis':'胸半棘肌','cervical rotator':'頸迴旋肌','thoracic rotator':'胸迴旋肌','lumbar rotator':'腰迴旋肌','interspinalis thoracis':'胸棘間肌','interspinales cervicis':'頸棘間肌','interspinales lumborum':'腰棘間肌','anterior cervical intertransversarii':'頸前側橫突間肌','posterior cervical intertransversarii':'頸後側橫突間肌','lateral lumbar intertransversarius':'腰外側橫突間肌','medial lumbar intertransversarius':'腰內側橫突間肌',
 'sternocleidomastoid':'胸鎖乳突肌','scalenus anterior':'前斜角肌','scalenus medius':'中斜角肌','scalenus posterior':'後斜角肌','splenius capitis':'頭夾肌','splenius cervicis':'頸夾肌','longus capitis':'頭長肌','longus colli':'頸長肌','rectus capitis anterior':'頭前直肌','rectus capitis lateralis':'頭外側直肌','rectus capitis posterior major':'頭後大直肌','rectus capitis posterior minor':'頭後小直肌','obliquus capitis inferior':'頭下斜肌','obliquus capitis superior':'頭上斜肌','platysma':'頸闊肌',
 'digastric':'二腹肌','mylohyoid':'下頷舌骨肌','geniohyoid':'頦舌骨肌','stylohyoid':'莖突舌骨肌','omohyoid':'肩胛舌骨肌','sternohyoid':'胸骨舌骨肌','sternothyroid':'胸骨甲狀肌','thyrohyoid':'甲狀舌骨肌','genioglossus':'頦舌肌','hyoglossus':'舌骨舌肌','styloglossus':'莖突舌肌',
 'aryepiglotticus':'杓會厭肌','lateral crico-arytenoid':'環杓側肌','posterior crico-arytenoid':'環杓後肌','oblique arytenoid':'杓斜肌','transverse arytenoid':'杓橫肌','thyro-arytenoid':'甲杓肌','cricothyroid':'環甲肌','vocalis':'聲帶肌','levator veli palatini':'提軟顎肌','tensor veli palatini':'張軟顎肌','uvular':'懸雍垂肌',
 'superior rectus':'上直肌','inferior rectus':'下直肌','medial rectus':'內直肌','lateral rectus':'外直肌','superior oblique':'上斜肌','inferior oblique':'下斜肌','levator palpebrae superioris':'提上眼瞼肌',
 'coccygeus':'尾骨肌','pubococcygeus':'恥骨尾骨肌','puborectalis':'恥骨直腸肌','iliococcygeus':'髂骨尾骨肌','external anal sphincter':'肛門外括約肌','superficial perineal':'會陰淺肌',
 'anterior papillary muscle of right ventricle':'右心室前乳突肌','posterior papillary muscle of right ventricle':'右心室後乳突肌','septal papillary muscle of right ventricle':'右心室中隔乳突肌','lateral papillary muscle of left ventricle':'左心室外側乳突肌','anterolateral head of lateral papillary muscle of left ventricle':'左心室外側乳突肌（前外側頭）',
 'muscle of head':'頭部肌群','muscle of thorax':'胸部肌群','muscle of abdomen':'腹部肌群','perineal muscle':'會陰肌群','muscle organ':'肌肉器官','infrahyoid muscle':'舌骨下肌群','suprahyoid muscle':'舌骨上肌群','intercostal muscle':'肋間肌','serratus posterior':'後鋸肌','obturator muscle':'閉孔肌','muscle of pelvis':'骨盆肌群','levator ani':'提肛肌','muscle of anterior abdominal wall':'腹前壁肌群',
 'gemellus':'孖肌','muscle of anterior compartment of thigh':'大腿前室肌群','muscle of posterior compartment of thigh':'大腿後室肌群','muscle of medial compartment of thigh':'大腿內側室肌群','muscle of thigh':'大腿肌群','muscle of vertebral column':'脊柱肌群','semispinalis':'半棘肌','interspinalis':'棘間肌','intertransversarius':'橫突間肌','lumbar intertransversarius':'腰橫突間肌','rotator':'迴旋肌','prevertebral muscle':'椎前肌群','postvertebral muscle':'椎後肌群','musculature':'肌群','superficial postvertebral muscle':'淺層椎後肌群','intermediate postvertebral muscle':'中層椎後肌群','deep postvertebral muscle':'深層椎後肌群','posterior suboccipital muscle':'後枕下肌群','anterior suboccipital muscle':'前枕下肌群',
 'muscle of free upper limb':'自由上肢肌群','pectoral muscle':'胸肌群','muscle of foot':'足部肌群','muscle of arm':'上臂肌群','muscle of forearm':'前臂肌群','muscle of hand':'手部肌群','interosseous':'骨間肌','muscle of anterior compartment of arm':'上臂前室肌群','muscle of posterior compartment of arm':'上臂後室肌群','muscle of anterior compartment of forearm':'前臂前室肌群','superficial muscle of anterior compartment of forearm':'前臂前室淺層肌群','deep muscle of anterior compartment of forearm':'前臂前室深層肌群','muscle of posterior compartment of forearm':'前臂後室肌群','superficial muscle of posterior compartment of forearm':'前臂後室淺層肌群','deep muscle of posterior compartment of forearm':'前臂後室深層肌群','intrinsic muscle of hand':'手內在肌群','organ':'器官',
 'muscle of larynx':'喉部肌群','muscle of tongue':'舌肌群','extrinsic muscle of tongue':'舌外在肌群','muscle of palate':'顎部肌群','muscle of face':'顏面肌群','extra-ocular muscle':'眼外肌群','musculature of subdivision of trunk':'軀幹分區肌群','musculature of subdivision of upper limb':'上肢分區肌群','musculature of subdivision of free upper limb':'自由上肢分區肌群','intrinsic muscle of larynx':'喉內在肌群','muscle of trunk':'軀幹肌群','superficial muscle of neck':'頸部淺層肌群','scalene':'斜角肌','thenar muscle':'魚際肌群','hypothenar muscle':'小魚際肌群','superficial muscle of posterior compartment of leg':'小腿後室淺層肌群','intrinsic muscle of foot':'足內在肌群','intrinsic muscle of dorsum of foot':'足背內在肌群','intrinsic muscle of plantar part of foot':'足底內在肌群','set of organs':'器官組','musculature of chest':'胸部肌群','iliocostalis':'髂肋肌','longissimus':'最長肌','splenius':'夾肌',
 'papillary muscle':'乳突肌','papillary muscle of right ventricle':'右心室乳突肌','papillary muscle of left ventricle':'左心室乳突肌','wall of right ventricle':'右心室壁','myocardium of right ventricle':'右心室心肌','anterior wall of right ventricle':'右心室前壁','inferior wall of right ventricle':'右心室下壁','anterior wall of left ventricle':'左心室前壁','lateral wall of left ventricle':'左心室外側壁','wall of inflow part of right ventricle':'右心室流入部壁','wall of inflow part of left ventricle':'左心室流入部壁','myocardium of right ventricle proper':'右心室本體心肌','free wall of right ventricle':'右心室游離壁','subendocardial layer of myocardium of right ventricle':'右心室心肌心內膜下層','subendocardial layer of myocardium of left ventricle':'左心室心肌心內膜下層','myocardium of free wall of right ventricle':'右心室游離壁心肌','myocardium of lateral wall of left ventricle':'左心室外側壁心肌',
 'perineum':'會陰','anterior abdominal wall':'腹前壁','anal part of perineum':'會陰肛門部','lateral chest wall':'外側胸壁','superficial chest wall':'淺層胸壁','anterior superficial chest wall':'前側淺層胸壁','lateral superficial chest wall':'外側淺層胸壁','soft palate':'軟顎','uvula':'懸雍垂','faucial part of mouth':'口腔咽峽部','musculature of anterior abdominal wall':'腹前壁肌群','musculature of abdomen':'腹部肌群',
};

const QUALIFIERS:Record<string,string>={
 'long head of':'長頭','short head of':'短頭','lateral head of':'外側頭','medial head of':'內側頭','superficial head of':'淺頭','deep head of':'深頭','humeral head of':'肱骨頭','ulnar head of':'尺骨頭','oblique head of':'斜頭','transverse head of':'橫頭',
 'abdominal part of':'腹部','acromial part of':'肩峰部','clavicular part of':'鎖骨部','spinal part of':'肩胛棘部','sternocostal part of':'胸肋部','ascending part of':'上行部','descending part of':'下行部','transverse part of':'橫部','inferior oblique part of':'下斜部','superior oblique part of':'上斜部','vertical intermediate part of':'中間垂直部','straight part of':'直部','oblique part of':'斜部',
};
const ORDINALS:Record<string,string>={first:'第一',second:'第二',third:'第三',fourth:'第四'};

export function localMuscleName(name:string):string|undefined{
 let text=name.toLowerCase().replace(/\s+/g,' ').trim();
 if(NAMES[text])return NAMES[text];
 const zone=text.match(/^myocardial zone (\d+)$/);if(zone)return `心肌第 ${zone[1]} 區`;
 for(const [prefix,suffix] of [['zone of ','區域'],['region of ','區域'],['head of ','（頭部）']]){
  if(text.startsWith(prefix)){const translated=localMuscleName(text.slice(prefix.length));return translated?translated+suffix:undefined;}
 }
 const group=text.startsWith('set of ');text=text.replace(/^set of /,'');
 const side=text.match(/\b(left|right)\b/),sideLabel=side?.[1]==='left'?'左側':side?'右側':'';
 text=text.replace(/\b(left|right)\s*/,'').replace(/\s+/g,' ').trim();
 const qualifier=Object.keys(QUALIFIERS).find(key=>text.startsWith(key+' '));
 if(qualifier)text=text.slice(qualifier.length).trim();
 const ordinal=text.split(' ')[0],ordinalLabel=ORDINALS[ordinal]??'';
 if(ordinalLabel)text=text.slice(ordinal.length).trim();
 const location=text.match(/ of (hand|foot)$/)?.[1];
 text=text.replace(/ of (hand|foot)$/,'').replace(/ muscle$/,'').trim();
 let translated=NAMES[text];
 if(!translated)return undefined;
 if(location==='foot')translated=translated.replace(/小指/g,'小趾').replace('對掌肌','對蹠肌');
 const locationLabel=location==='foot'&&!/[趾足蹠]/.test(translated)?'足部':location==='hand'&&!/[指掌]/.test(translated)?'手部':'';
 return sideLabel+ordinalLabel+locationLabel+translated+(group?'群':'')+(qualifier?`（${QUALIFIERS[qualifier]}）`:'');
}
