<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const props = defineProps<{ interior?: boolean }>()
const host = ref<HTMLDivElement>()
const ready = ref(false)
const failed = ref(false)
const entering = ref('')
const hovered = ref('')
const router = useRouter()
const rooms = [
  { id:'design', number:'01', name:'디자인 시스템', note:'ispark-ui · Storybook ↗', href:'https://box3101.github.io/ispark-ui/', x:-5.5, z:0, color:0xffbf7a },
  { id:'agents', number:'02', name:'AI 에이전트', note:'제안서 · TeamAgent · TaskFlow', href:'/agents', x:0, z:-1.2, color:0x8dd9f5 },
  { id:'si', number:'03', name:'SI 프로젝트', note:'현장에서 만든 제품들', href:'/projects?space=si', x:5.5, z:0, color:0xd6b5ff },
]
const labels = ref<Record<string,{left:string;top:string}>>({})
let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let camera: THREE.PerspectiveCamera | undefined
let controls: OrbitControls | undefined
let observer: ResizeObserver | undefined
let frame = 0
let disposed = false
let fly: { start:number; from:THREE.Vector3; to:THREE.Vector3; targetFrom:THREE.Vector3; targetTo:THREE.Vector3; href:string } | undefined
const reduced = ref(false)
const assets: THREE.Texture[] = []
const roomLights: THREE.PointLight[] = []
let basePosition = new THREE.Vector3(9,10,23)
function resetView() {
  if (!camera || !controls) return
  fly=undefined; entering.value=''; controls.enabled=true
  camera.position.copy(basePosition); controls.target.set(0,props.interior?1.8:1.3,props.interior?-1.2:0); controls.update(); if(props.interior)controls.enabled=false
}
function enter(event:MouseEvent, room:typeof rooms[number]) {
  if(room.id==='design'||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0||!ready.value||reduced.value) return
  event.preventDefault()
  if(!camera||!controls||entering.value) return
  entering.value=room.id; controls.enabled=false
  fly={start:performance.now(),from:camera.position.clone(),to:new THREE.Vector3(room.x,3.4,room.z+6),targetFrom:controls.target.clone(),targetTo:new THREE.Vector3(room.x,1.8,room.z-1),href:room.href}
}
onMounted(async () => {
  await nextTick()
  if(!host.value) return
  reduced.value=matchMedia('(prefers-reduced-motion: reduce)').matches
  try {
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'})
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.7)); renderer.shadowMap.enabled=true
    renderer.shadowMap.type=THREE.PCFSoftShadowMap
    renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.45
    host.value.prepend(renderer.domElement)
    renderer.domElement.setAttribute('aria-label','세 작업 공간이 있는 3D 스튜디오. 드래그하여 시점을 바꿀 수 있습니다.')
    renderer.domElement.addEventListener('webglcontextlost',()=>{failed.value=true;ready.value=false})
    scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x071321,.014)
    camera=new THREE.PerspectiveCamera(36,1,.1,100)
    controls=new OrbitControls(camera,renderer.domElement)
    controls.enableDamping=true;controls.dampingFactor=.06;controls.enablePan=false;controls.enableZoom=false
    controls.minPolarAngle=.8;controls.maxPolarAngle=1.22;controls.minAzimuthAngle=-.46;controls.maxAzimuthAngle=.58
    controls.target.set(0,1.3,0)
    const ambient=new THREE.HemisphereLight(0xaccbff,0x27334a,2.3);scene.add(ambient)
    const moon=new THREE.DirectionalLight(0xa8ccff,3);moon.position.set(-8,14,6);moon.castShadow=true
    moon.shadow.mapSize.set(2048,2048);moon.shadow.camera.left=-16;moon.shadow.camera.right=16;moon.shadow.camera.top=12;moon.shadow.camera.bottom=-12;moon.shadow.bias=-.0008;scene.add(moon)
    const material=(color:number,roughness=.65,metalness=.15)=>new THREE.MeshStandardMaterial({color,roughness,metalness})
    const stone=material(0x26364a), frameMat=material(0x091421,.35,.6), wood=material(0x95694b), wall=material(0x445268), pale=material(0xc4cbd1)
    function box(parent:THREE.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,mat:THREE.Material) {
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh
    }
    function glow(color:number){return new THREE.MeshBasicMaterial({color})}
    const loader=new THREE.TextureLoader()
    function screen(parent:THREE.Object3D,url:string,x:number,y:number,z:number,w:number,h:number) {
      box(parent,x,y,z,w+.09,h+.09,.1,frameMat)
      const texture=loader.load(url,()=>{if(disposed)texture.dispose()});texture.colorSpace=THREE.SRGBColorSpace;assets.push(texture)
      const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));plane.position.set(x,y,z+.06);parent.add(plane)
    }
    function plant(parent:THREE.Object3D,x:number,z:number,size=1) {
      const pot=new THREE.Mesh(new THREE.CylinderGeometry(.27*size,.2*size,.48*size,12),stone);pot.position.set(x,.3*size,z);pot.castShadow=true;parent.add(pot)
      box(parent,x,.85*size,z,.05*size,1.2*size,.05*size,wood)
      for(let i=0;i<7;i++){const leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(.35*size,1),material(i%2?0x426c5c:0x244d43));leaf.position.set(x+Math.sin(i*2.4)*.3*size,(1.05+i*.09)*size,z+Math.cos(i*2.4)*.25*size);leaf.scale.set(1,.7,1);leaf.castShadow=true;parent.add(leaf)}
    }
    // A raised courtyard with individually modelled stone slabs and brass seams.
    box(scene,0,-.34,0,19,.65,11,frameMat)
    for(let x=-9;x<9;x+=1.5)for(let z=-4.5;z<5;z+=1.5)box(scene,x+.7,.015,z+.7,1.46,.07,1.46,material((Math.round((x+z)*2)%3===0)?0x344557:0x293a4e,.35,.3))
    for(const x of [-9.2,9.2])box(scene,x,.08,0,.045,.025,10.4,glow(0x9fc9e5))
    box(scene,0,-.13,5.8,12,.3,1.1,stone);box(scene,0,-.3,6.4,10,.25,.55,stone)
    rooms.forEach((room,index)=>{
      const group=new THREE.Group();group.position.set(room.x,0,room.z);scene!.add(group)
      const warm=glow(room.color)
      box(group,0,.15,-.8,5.05,.28,4.4,wood)
      box(group,0,1.85,-2.9,5,3.6,.18,wall)
      for(const x of [-2.47,2.47]){
        box(group,x,1.85,-.8,.12,3.65,4.3,frameMat)
        box(group,x,1.8,1.33,.12,3.6,.12,frameMat)
      }
      // Cantilevered roof and a glowing inset give the entrances physical depth.
      box(group,0,3.8,-.55,5.4,.28,4.95,stone)
      box(group,0,3.63,-.4,4.8,.045,4.3,frameMat)
      box(group,0,3.58,1.58,4.9,.025,.05,warm)
      box(group,0,.31,1.55,4.9,.035,.05,warm)
      box(group,0,3.2,1.48,5,.43,.18,frameMat)
      for(let j=-2;j<=2;j++)box(group,j,1.8,-2.76,.025,3.4,.035,wood)
      const light=new THREE.PointLight(room.color,20,8,2);light.position.set(0,2.8,0);group.add(light);roomLights.push(light)
      // Furnished interior: a desk, seating, screen and shallow storage shelving.
      box(group,0,1.03,-.85,3.7,.12,1.05,wood)
      for(const x of [-1.6,1.6])for(const z of [-1.22,-.48])box(group,x,.56,z,.07,.9,.07,frameMat)
      for(const x of [-1,1]){
        box(group,x,.7,.32,.63,.12,.65,frameMat);box(group,x,1.05,.61,.63,.7,.09,wall)
        for(const dx of [-.25,.25])box(group,x+dx,.4,.32,.05,.55,.05,frameMat)
      }
      if(index===0){
        for(let i=0;i<9;i++)box(group,-1.35+(i%3)*1.35,1.7+Math.floor(i/3)*.48,-2.65,.82,.29,.1,material([0x8dd9f5,0xc8bbf4,0xeabf88][i%3]!))
        screen(group,'/images/pt-ispark-ui.svg',0,1.65,-.9,1.6,.9)
      } else if(index===1){
        screen(group,'/images/work/proposal-ui-concept.png',-.95,1.65,-.9,1.65,.95)
        screen(group,'/images/work/proposal-ui-concept.png',.95,1.65,-.9,1.65,.95)
        const ring=new THREE.Mesh(new THREE.TorusGeometry(1.3,.025,8,64),warm);ring.rotation.x=Math.PI/2;ring.position.set(0,3.25,-.6);group.add(ring)
        for(let j=0;j<5;j++){const node=new THREE.Mesh(new THREE.SphereGeometry(.11,12,12),warm);node.position.set(Math.sin(j)*1.4,2.2+Math.cos(j)*.45,-2.7);group.add(node)}
      } else {
        screen(group,'/images/pt-incheon-city.png',0,2.03,-2.7,3.5,1.8)
        screen(group,'/images/samsung-sdi-gsop.png',0,1.63,-.9,1.65,.95)
      }
      plant(group,-1.95,-2.15,.7);plant(group,2.02,.65,.65)
      // Fine mullions and lightly tinted side glazing, with an open central doorway.
      const glass=new THREE.MeshPhysicalMaterial({color:0xb2dcff,transparent:true,opacity:.1,roughness:.15,metalness:.4,side:THREE.DoubleSide,depthWrite:false})
      for(const x of [-1.95,1.95]){box(group,x,1.75,1.38,.95,2.8,.025,glass);box(group,x-.49,1.76,1.39,.035,2.95,.04,frameMat)}
    })
    // Courtyard trees, benches and low lights give scale to the architecture.
    for(const [x,z] of [[-8.6,3.6],[8.6,3.6],[-8.7,-4],[8.7,-4]])plant(scene,x!,z!,1.6)
    for(const x of [-4,4]){box(scene,x,.53,3.35,2,.13,.55,wood);box(scene,x-.7,.28,3.35,.12,.4,.4,stone);box(scene,x+.7,.28,3.35,.12,.4,.4,stone)}
    for(const x of [-7,7]){box(scene,x,.5,4.1,.13,1,.13,frameMat);box(scene,x,.98,4.1,.2,.08,.2,glow(0xffce92))}
    // Quiet silhouettes beyond the studio, rather than a flat background photograph.
    for(let i=0;i<20;i++){const h=1+(Math.sin(i*3.7)+1)*2;box(scene,(i-10)*2.4,h/2,-13-(i%3)*2,1.3,h,1.6,material(0x111f35));}
    const resize=()=>{if(!host.value||!renderer||!camera||!controls)return;const {width,height}=host.value.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();basePosition=props.interior?new THREE.Vector3(2,5,13):new THREE.Vector3(8,width<650?15:10,width<650?37:23);if(!entering.value)resetView()}
    observer=new ResizeObserver(resize);observer.observe(host.value);resize();ready.value=true
    const render=(time:number)=>{
      if(disposed||!renderer||!scene||!camera||!controls)return
      if(fly){const t=Math.min(1,(time-fly.start)/900);const e=1-Math.pow(1-t,3);camera.position.lerpVectors(fly.from,fly.to,e);controls.target.lerpVectors(fly.targetFrom,fly.targetTo,e);camera.lookAt(controls.target);if(t===1){const href=fly.href;fly=undefined;void router.push(href)}}else controls.update()
      roomLights.forEach((light,i)=>{light.intensity=THREE.MathUtils.lerp(light.intensity,hovered.value===rooms[i]!.id?35:20,.08)})
      const width=host.value!.clientWidth,height=host.value!.clientHeight
      const positions:Record<string,{left:string;top:string}>={}
      rooms.forEach(room=>{const v=new THREE.Vector3(room.x,3.55,room.z+1.65).project(camera!);positions[room.id]={left:`${(v.x*.5+.5)*width}px`,top:`${(-v.y*.5+.5)*height}px`}});labels.value=positions
      if(!document.hidden)renderer.render(scene,camera)
      frame=requestAnimationFrame(render)
    }
    frame=requestAnimationFrame(render)
  }catch(error){failed.value=true;ready.value=false;console.warn('Spatial view unavailable; using accessible room links.',error)}
})
onBeforeUnmount(()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();controls?.dispose();scene?.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(m=>m.dispose())}});assets.forEach(t=>t.dispose());renderer?.dispose()})
</script>
<template>
  <div ref="host" class="spatial-world" :class="{ready,failed,interior,'is-entering':entering}">
    <div v-if="!ready" class="css-world" aria-hidden="true"><div class="css-stage"><div class="css-plaza" /><div v-for="(room,i) in rooms" :key="room.id" class="css-room" :style="{ '--room-x':`${(i-1)*280}px`, '--room-z':`${i===1?-70:0}px`, '--light':i===0?'#ffc68a':i===1?'#8dd9f5':'#c8b1ff' }"><div class="css-wall back"><img :src="i===0?'/images/pt-ispark-ui.svg':i===1?'/images/work/proposal-ui-concept.png':'/images/pt-incheon-city.png'" alt="" /></div><div class="css-wall left" /><div class="css-wall right" /><div class="css-floor" /><div class="css-roof" /><div class="css-desk" /><div class="css-front"><span>{{ room.number }}</span><strong>{{ room.name }}</strong></div><div class="css-plant" /></div><div class="css-step" /></div></div>
    <nav class="spatial-doors" :class="{'fallback-doors':!ready}" aria-label="작업 공간 선택">
      <a v-for="room in rooms" :key="room.id" :href="room.href" :target="room.id==='design'?'_blank':undefined" :rel="room.id==='design'?'noopener noreferrer':undefined" class="spatial-door" :style="ready?labels[room.id]:undefined" @click="enter($event,room)" @mouseenter="hovered=room.id" @mouseleave="hovered=''" @focus="hovered=room.id" @blur="hovered=''">
        <span class="door-index">{{ room.number }}</span><span><strong>{{ room.name }}</strong><small>{{ room.note }}</small></span><span class="door-arrow">↗</span>
      </a>
    </nav>
    <div class="scene-controls"><p>{{ failed?'공간을 선택해 둘러보세요':'드래그해서 둘러보고, 공간을 선택하세요' }}</p><button v-if="ready" type="button" @click="resetView">시점 초기화 ↺</button></div>
    <p v-if="entering" class="entering-label" role="status">공간으로 들어가는 중…</p>
  </div>
</template>
<style scoped>
.css-world { position:absolute; inset:0; overflow:hidden; perspective:1300px; background:radial-gradient(ellipse at 50% 60%,#23415e88,transparent 65%); }.css-stage { position:absolute; width:0; height:0; left:50%; top:54%; transform-style:preserve-3d; transform:rotateX(-21deg) rotateY(-20deg); }.css-plaza { position:absolute; width:1000px; height:600px; margin-left:-500px; margin-top:-300px; transform:translateY(110px) rotateX(90deg); background:repeating-linear-gradient(0deg,transparent 0 73px,#91b5d230 74px 75px),repeating-linear-gradient(90deg,#263a4f 0 73px,#6b8ba440 74px 75px); box-shadow:0 0 0 5px #8dd9f530,0 25px 0 6px #07111f,0 50px 90px #0009; }.css-room { position:absolute; width:240px; height:180px; margin-left:-120px; margin-top:-90px; transform:translateX(var(--room-x)) translateZ(var(--room-z)); transform-style:preserve-3d; }.css-wall { position:absolute; inset:0; background:#243447; border:3px solid #0b1724; }.css-wall.back { transform:translateZ(-100px); display:flex; align-items:center; justify-content:center; background:repeating-linear-gradient(90deg,#3d4350 0 29px,#ba8d6040 30px 32px); box-shadow:inset 0 15px 25px #ffc68a30; }.css-wall.back img { width:180px; height:100px; object-fit:contain; background:#eef3f8; border:5px solid #0d1928; box-shadow:0 0 30px #7bb9ed50; }.css-wall.left,.css-wall.right { width:200px; left:20px; background:linear-gradient(110deg,#4d617340,#8dd9f510); border:4px solid #162537; }.css-wall.left { transform:rotateY(90deg) translateZ(-120px); }.css-wall.right { transform:rotateY(90deg) translateZ(120px); }.css-floor { position:absolute; width:240px; height:200px; top:-10px; transform:translateY(90px) rotateX(90deg); background:repeating-linear-gradient(90deg,#8d6c50 0 18px,#b68b60 19px 20px); box-shadow:inset 0 0 40px #edb56755; }.css-roof { position:absolute; width:264px; height:225px; left:-12px; top:-22px; transform:translateY(-93px) rotateX(90deg); background:linear-gradient(130deg,#3d5065,#142133); border:3px solid #58728a; box-shadow:0 5px 0 #08121f; }.css-front { position:absolute; height:30px; left:-4px; right:-4px; top:-6px; transform:translateZ(105px); background:#101d2d; border-bottom:2px solid var(--light); box-shadow:0 10px 28px color-mix(in srgb,var(--light) 30%,transparent); display:flex; align-items:center; justify-content:center; gap:12px; color:#e2edf5; font-size:12px; }.css-front span { color:var(--light); }.css-desk { position:absolute; width:165px; height:60px; left:38px; top:66px; transform:translateZ(25px) rotateX(90deg); background:#a07955; border:3px solid #4a3d31; box-shadow:0 0 20px #ffd69a20; }.css-plant { position:absolute; width:32px; height:75px; right:4px; bottom:0; transform:translateZ(75px); background:radial-gradient(ellipse at 50% 35%,#457264 0 40%,transparent 42%),linear-gradient(90deg,transparent 25%,#27394a 25% 75%,transparent 75%) bottom/100% 25px no-repeat; }.css-step { position:absolute; width:650px; height:65px; left:-325px; top:90px; transform:translateZ(315px) rotateX(90deg); background:#3c5267; box-shadow:0 8px 0 #111e2f; }
.spatial-world:not(.ready) .fallback-doors { align-items:flex-end; padding-bottom:90px; gap:5vw; }.interior .css-stage { transform:scale(1.8) rotateX(-8deg); top:28%; }.interior .css-world { opacity:.55; }
@media(max-width:740px) { .css-stage { transform:scale(.49) rotateX(-22deg) rotateY(-18deg); top:45%; }.spatial-world:not(.ready) .fallback-doors { flex-direction:row; align-items:flex-end; gap:10px; padding-bottom:120px; }.spatial-world:not(.ready) .fallback-doors .spatial-door { padding:10px 8px; }.interior .css-stage { transform:scale(.9) rotateX(-8deg); } }

.spatial-world.interior { inset:0; pointer-events:none; }.interior .spatial-doors,.interior .scene-controls { display:none; }
.spatial-world { position:absolute; inset:165px 0 20px; touch-action:pan-y; }.spatial-world :deep(canvas) { display:block; width:100%; height:100%; cursor:grab; }.spatial-world :deep(canvas:active) { cursor:grabbing; }.scene-fallback { position:absolute; inset:0; background:url('/images/studio-courtyard.webp') center/cover; opacity:.5; }.spatial-doors { position:absolute; inset:0; pointer-events:none; }.spatial-door { position:absolute; transform:translate(-50%,-50%); pointer-events:auto; display:flex; align-items:center; gap:12px; color:#fff; text-decoration:none; padding:12px 16px; border:1px solid #c7e4ff60; background:#08182be8; box-shadow:0 8px 25px #0008,0 0 25px #8dd9f510; border-radius:4px; white-space:nowrap; backdrop-filter:blur(12px); transition:border-color .2s,background .2s; }.spatial-door:hover,.spatial-door:focus-visible { border-color:#8dd9f5; background:#143452; }.door-index { font-size:11px; color:#8dd9f5; }.spatial-door strong { font-size:14px; font-weight:600; display:block; }.spatial-door small { display:block; margin-top:3px; font-size:9px; color:#a9bdd2; }.door-arrow { margin-left:5px; color:#a1d2ed; }.scene-controls { position:absolute; left:50%; bottom:25px; transform:translateX(-50%); display:flex; align-items:center; gap:22px; white-space:nowrap; font-size:11px; color:#9cb0c9; }.scene-controls p { margin:0; }.scene-controls button { border:1px solid #a6c6e440; border-radius:20px; padding:7px 12px; background:#08182b80; color:#b7cee6; }.is-entering .spatial-doors,.is-entering .scene-controls { opacity:0; transition:opacity .3s; }.entering-label { position:absolute; bottom:12%; left:0; right:0; text-align:center; font-size:13px; color:#d8eafa; }.fallback-doors { display:flex; align-items:center; justify-content:center; gap:24px; }.fallback-doors .spatial-door { position:relative; transform:none; }
@media(max-width:740px) { .spatial-world { inset:215px 0 30px; }.spatial-door { padding:8px 9px; gap:6px; }.spatial-door strong { font-size:11px; }.spatial-door small { display:none; }.door-index { font-size:9px; }.door-arrow { display:none; }.scene-controls { font-size:9px; gap:10px; bottom:35px; }.fallback-doors { flex-direction:column; gap:15px; } }
</style>
