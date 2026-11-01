<script setup lang="ts">
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
const host = ref<HTMLDivElement>()
const failed = ref(false)
const ready = ref(false)
let cleanup = () => {}
let disposed = false
onMounted(async () => {
  await nextTick()
  const el = host.value
  if (!el) return
  let renderer: THREE.WebGLRenderer | undefined
  const textures: THREE.Texture[] = []
  const scene = new THREE.Scene()
  let observer: ResizeObserver | undefined
  let pmrem: THREE.PMREMGenerator | undefined
  let environment: THREE.WebGLRenderTarget | undefined
  let room: RoomEnvironment | undefined
  cleanup = () => {
    disposed = true; observer?.disconnect()
    scene.traverse(obj => { if (obj instanceof THREE.Mesh) { obj.geometry.dispose(); (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose()) } })
    textures.forEach(t => t.dispose()); environment?.dispose(); pmrem?.dispose(); room?.dispose()
    renderer?.dispose(); renderer?.domElement.remove()
  }
  try {
    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' })
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.shadowMap.enabled=true
    renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15
    renderer.domElement.setAttribute('aria-label','원형 석재 전시대와 세 유리 패널이 있는 3D 스튜디오')
    el.appendChild(renderer.domElement)
    scene.background = new THREE.Color('#c9e1ef'); scene.fog=new THREE.Fog('#d7e5e9',28,65)
    pmrem=new THREE.PMREMGenerator(renderer); room=new RoomEnvironment(); environment=pmrem.fromScene(room,.05); scene.environment=environment.texture
    const camera=new THREE.PerspectiveCamera(37,1,.1,100)
    camera.position.set(4.5,4.6,14); camera.lookAt(.1,2.1,0)
    scene.add(new THREE.HemisphereLight('#e8f2ff','#b9a48c',2.4))
    const sun=new THREE.DirectionalLight('#fff3d9',4.5); sun.position.set(-6,10,5); sun.castShadow=true
    sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.5,far:35});sun.shadow.normalBias=.025;sun.shadow.bias=-.0001; scene.add(sun)
    const stoneCanvas=document.createElement('canvas'); stoneCanvas.width=512;stoneCanvas.height=512
    const sc=stoneCanvas.getContext('2d')!;sc.fillStyle='#e0d3bd';sc.fillRect(0,0,512,512)
    let seed=41;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}
    for(let i=0;i<16000;i++){sc.fillStyle=`rgba(${random()>.5?'255,251,238':'133,114,89'},${random()*.16})`;sc.fillRect(random()*512,random()*512,random()*2+.3,random()*2+.3)}
    const stoneTexture=new THREE.CanvasTexture(stoneCanvas);stoneTexture.colorSpace=THREE.SRGBColorSpace;stoneTexture.wrapS=stoneTexture.wrapT=THREE.RepeatWrapping;stoneTexture.repeat.set(3,3);textures.push(stoneTexture)
    const stone=new THREE.MeshStandardMaterial({color:'#fff9ee',map:stoneTexture,roughness:.72})
    const floorMat=new THREE.MeshStandardMaterial({color:'#eee5d7',map:stoneTexture,roughness:.38,metalness:.05})
    function mesh(geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
    const floor=mesh(new THREE.PlaneGeometry(70,70),floorMat,0,-.03,0);floor.rotation.x=-Math.PI/2
    // True geometry: shared plinth, curved roof and a slim structural column.
    mesh(new THREE.CylinderGeometry(4.1,4.12,.42,128),stone,2.35,.21,0)
    mesh(new THREE.CylinderGeometry(4.06,4.06,.025,128),new THREE.MeshStandardMaterial({color:'#f6eee1',roughness:.26,map:stoneTexture}),2.35,.435,0)
    mesh(new THREE.CylinderGeometry(.27,.3,7.2,48),stone,-2.8,3.6,-2.1)
    const canopy=new THREE.Shape();canopy.absarc(0,0,11.5,0,Math.PI*2,false)
    const hole=new THREE.Path();hole.absarc(0,0,8.4,0,Math.PI*2,true);canopy.holes.push(hole)
    const roof=mesh(new THREE.ExtrudeGeometry(canopy,{depth:.3,bevelEnabled:false,curveSegments:96}),stone,0,7,-1);roof.rotation.x=-Math.PI/2
    const ocean=mesh(new THREE.PlaneGeometry(150,70),new THREE.MeshStandardMaterial({color:'#79acc2',roughness:.27,metalness:.25}),0,-.15,-39);ocean.rotation.x=-Math.PI/2;ocean.receiveShadow=false
    // Keep the horizon unobstructed, with a low gallery boundary.
    mesh(new THREE.BoxGeometry(28,.42,.25),stone,0,.21,-8)
    const glass=new THREE.MeshPhysicalMaterial({color:'#bbdfff',metalness:0,roughness:.13,transmission:.72,thickness:.12,ior:1.46,envMapIntensity:1.05,clearcoat:1,clearcoatRoughness:.09})
    const edge=new THREE.MeshStandardMaterial({color:'#4388bd',metalness:.42,roughness:.22})
    const ribbonImage=new Image();ribbonImage.src='/images/gallery-ribbon.webp'
    await Promise.all([document.fonts.ready,ribbonImage.decode().catch(()=>{})]);if(disposed)return
    function artwork(kind:string){
      const c=document.createElement('canvas');c.width=1200;c.height=1450;const ctx=c.getContext('2d')!
      const rounded=(x:number,y:number,w:number,h:number,r:number,color:string)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
      const text=(s:string,x:number,y:number,size:number,color='#183654',weight=400)=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px Pretendard, sans-serif`;ctx.fillText(s,x,y)}
      text(kind==='proposal'?'제안서 AI 에이전트':kind==='design'?'디자인 시스템':'프로젝트',65,105,36,'#173653',600)
      text(kind==='proposal'?'01 / IDEA TO PRODUCT':kind==='design'?'02 / DESIGN LANGUAGE':'03 / SELECTED WORK',65,155,18,'#506e89')
      const gradient=ctx.createLinearGradient(50,200,1100,1250);gradient.addColorStop(0,'#eff7fff2');gradient.addColorStop(1,'#c8def0e8');ctx.fillStyle=gradient;ctx.beginPath();ctx.roundRect(55,220,1090,1040,16);ctx.fill()
      if(kind==='proposal'){
        text('Proposal AI',115,345,75,'#183654',500);text('좋은 제안이,',118,418,31,'#506a88');text('더 많은 가능성을 만듭니다.',118,462,31,'#506a88')
        if(ribbonImage.naturalWidth)ctx.drawImage(ribbonImage,525,270,550,750)
        rounded(115,1010,970,130,24,'#ffffffdc');text('어떤 제안을 시작할까요?',150,1085,29,'#6e879f');rounded(980,1045,65,65,33,'#346de2');text('→',994,1091,39,'white')
        for(const [i,label] of ['중점 찾기','스토리 구상','목차 구성'].entries()){rounded(120+i*315,1170,290,55,26,'#ffffff80');text(label,152+i*315,1208,22,'#57718e')}
      }else if(kind==='design'){
        text('일관된 화면,',115,350,64,'#183654',600);text('자연스러운 경험.',115,430,64,'#183654',600)
        rounded(110,520,460,320,22,'#ffffffd9');text('Aa',155,710,150,'#183654',500);text('Pretendard',155,785,27,'#71889e')
        rounded(600,520,485,320,22,'#ffffffd9');for(let i=0;i<4;i++)rounded(635+i*106,615,75,75,38,['#254bb5','#457de6','#a8c7ee','#1e344c'][i]!)
        rounded(110,870,975,165,22,'#ffffffd9');text('작은 요소가 만드는 완성도',150,965,39,'#385675',500)
        rounded(110,1065,460,130,22,'#ffffffd9');rounded(160,1107,110,48,24,'#3d6cdb');rounded(217,1114,33,33,17,'white');text('ON',305,1144,28,'#57718e')
        rounded(600,1065,485,130,22,'#3263d2');text('컴포넌트 보기  ↗',660,1145,32,'white',600)
      }else{
        text('경험을 쌓고,',115,350,64,'#183654',600);text('가치를 만듭니다.',115,430,64,'#183654',600)
        const g=ctx.createLinearGradient(100,550,1000,1000);g.addColorStop(0,'#b0cce1');g.addColorStop(1,'#f2dfbd');ctx.fillStyle=g;ctx.fillRect(115,520,970,500)
        ctx.strokeStyle='#fff9ed';ctx.lineWidth=80;ctx.beginPath();ctx.moveTo(280,1020);ctx.lineTo(280,770);ctx.bezierCurveTo(280,540,690,540,690,770);ctx.lineTo(690,1020);ctx.stroke()
        ctx.fillStyle='#6b94b3';ctx.fillRect(790,720,170,300);rounded(900,565,95,95,48,'#fff9e5')
        text('현장의 문제를 화면으로 해결합니다.',120,1100,31,'#385675');text('업무 이해   /   설계   /   프론트엔드 개발',120,1170,24,'#617b93')
      }
      text('CY.  —  FRONTEND · DESIGN · AI',65,1370,19,'#4b6e8e')
      const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer!.capabilities.getMaxAnisotropy();textures.push(t);return t
    }
    const panels=[{kind:'design',x:-.35,z:-.5,w:1.62,h:2.23,angle:.1},{kind:'proposal',x:2.05,z:.68,w:2.75,h:3.62,angle:-.12},{kind:'projects',x:4.8,z:-.45,w:1.85,h:2.55,angle:-.2}]
    for(const p of panels){
      const group=new THREE.Group();group.position.set(p.x,.49,p.z);group.rotation.y=p.angle;scene.add(group)
      const slab=new THREE.Mesh(new RoundedBoxGeometry(p.w,p.h,.09,3,.025),glass);slab.position.y=p.h/2+.12;slab.castShadow=false;group.add(slab)
      const graphic=new THREE.Mesh(new THREE.PlaneGeometry(p.w-.035,p.h-.035),new THREE.MeshBasicMaterial({map:artwork(p.kind),transparent:true,depthWrite:false,toneMapped:false}));graphic.position.set(0,p.h/2+.12,.051);group.add(graphic)
      for(const x of [-p.w/2+.12,p.w/2-.12]){const support=new THREE.Mesh(new RoundedBoxGeometry(.18,.18,.34,2,.015),glass);support.position.set(x,.09,0);group.add(support)}
      const trim=new THREE.Mesh(new THREE.BoxGeometry(.012,p.h-.04,.095),edge);trim.position.set(p.w/2-.008,p.h/2+.12,0);group.add(trim)
    }
    // A restrained physical accent, with real environment reflections.
    mesh(new THREE.SphereGeometry(.23,48,32),new THREE.MeshStandardMaterial({color:'#e0d6bc',metalness:.9,roughness:.15}),5.7,.68,.7)
    const render=()=>{if(!disposed&&renderer){renderer.render(scene,camera);ready.value=true}}
    const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer!.setSize(w,h);camera.aspect=w/h;camera.position.set(w<740?5:4.5,w<740?5.8:4.6,w<740?20:14);camera.lookAt(w<740?2:.1,2.1,0);camera.updateProjectionMatrix();render()}
    observer=new ResizeObserver(resize);observer.observe(el);resize()
    renderer.domElement.addEventListener('webglcontextlost',()=>{failed.value=true;ready.value=false})
  }catch(error){console.error('Studio render failed',error);failed.value=true;cleanup()}
})
onBeforeUnmount(()=>cleanup())
</script>
<template><div ref="host" class="story-world"><p v-if="failed" class="render-status">이 환경에서는 3D 화면을 표시할 수 없습니다.</p><p v-else-if="!ready" class="render-status">스튜디오를 준비하고 있습니다</p></div></template>
<style scoped>.story-world{position:absolute;inset:0}.story-world :deep(canvas){display:block;width:100%;height:100%}.render-status{position:absolute;right:10%;top:50%;font-size:14px;color:#29445f}.render-status span{display:block}</style>
