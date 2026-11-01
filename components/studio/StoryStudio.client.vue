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
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2
    renderer.domElement.setAttribute('aria-label', '원형 석재 전시대와 세 유리 패널이 있는 3D 스튜디오')
    el.appendChild(renderer.domElement)

    // === 배경: 따뜻한 골든아워 그라디언트 ===
    const bgCanvas = document.createElement('canvas'); bgCanvas.width = 1920; bgCanvas.height = 1080
    const bgCtx = bgCanvas.getContext('2d')!
    const skyGrad = bgCtx.createLinearGradient(0, 0, 0, 1080)
    skyGrad.addColorStop(0, '#7aadcc'); skyGrad.addColorStop(0.28, '#a4c5d8')
    skyGrad.addColorStop(0.48, '#c5d5dc'); skyGrad.addColorStop(0.60, '#d4c9b8')
    skyGrad.addColorStop(0.75, '#dfd7c5'); skyGrad.addColorStop(1.0, '#e8e0d2')
    bgCtx.fillStyle = skyGrad; bgCtx.fillRect(0, 0, 1920, 1080)
    const sunGrad = bgCtx.createRadialGradient(1580, 320, 0, 1580, 320, 650)
    sunGrad.addColorStop(0, 'rgba(255,225,140,0.72)'); sunGrad.addColorStop(0.45, 'rgba(255,200,100,0.38)'); sunGrad.addColorStop(1, 'rgba(255,200,100,0)')
    bgCtx.fillStyle = sunGrad; bgCtx.fillRect(0, 0, 1920, 1080)
    const bgTex = new THREE.CanvasTexture(bgCanvas); bgTex.colorSpace = THREE.SRGBColorSpace
    scene.background = bgTex; scene.fog = new THREE.Fog('#dcd4c2', 30, 75)

    // === PMREM 환경맵 ===
    pmrem = new THREE.PMREMGenerator(renderer); room = new RoomEnvironment()
    environment = pmrem.fromScene(room, .04); scene.environment = environment.texture

    // === 카메라 ===
    const camera = new THREE.PerspectiveCamera(46, 1, .1, 100)
    camera.position.set(0, 4.6, 11.5); camera.lookAt(0, 3.4, 0)

    // === 조명 ===
    scene.add(new THREE.HemisphereLight('#ffe5c8', '#c8b8a0', 2.0))
    const sun = new THREE.DirectionalLight('#ffd890', 5.5)
    sun.position.set(9, 10, -6); sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    Object.assign(sun.shadow.camera, {left:-16, right:16, top:16, bottom:-16, near:.5, far:45})
    sun.shadow.normalBias = .022; sun.shadow.bias = -.0001; scene.add(sun)
    const fill = new THREE.DirectionalLight('#c8dcff', 0.9); fill.position.set(-6, 7, 9); scene.add(fill)
    const backGlow = new THREE.PointLight('#ffb850', 4.2, 28); backGlow.position.set(8, 3.0, -6); scene.add(backGlow)
    const rimLight = new THREE.PointLight('#ffd090', 2.2, 18); rimLight.position.set(6, 6, 2); scene.add(rimLight)

    // === 텍스처: 따뜻한 석재 ===
    const stoneCanvas = document.createElement('canvas'); stoneCanvas.width = 512; stoneCanvas.height = 512
    const sc = stoneCanvas.getContext('2d')!; sc.fillStyle = '#e2d6c0'; sc.fillRect(0, 0, 512, 512)
    let seed = 41; const random = () => { seed=(seed*16807)%2147483647; return (seed-1)/2147483646 }
    for (let i = 0; i < 18000; i++) {
      sc.fillStyle = `rgba(${random()>.5?'255,248,230':'148,128,95'},${random()*.15})`
      sc.fillRect(random()*512, random()*512, random()*2.2+.3, random()*2.2+.3)
    }
    const stoneTexture = new THREE.CanvasTexture(stoneCanvas); stoneTexture.colorSpace = THREE.SRGBColorSpace
    stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping; stoneTexture.repeat.set(3, 3); textures.push(stoneTexture)
    const stone = new THREE.MeshStandardMaterial({color:'#f5edd8', map:stoneTexture, roughness:.74})
    const floorMat = new THREE.MeshStandardMaterial({color:'#ede3d0', map:stoneTexture, roughness:.40, metalness:.04})

    function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
      const m = new THREE.Mesh(geometry, material); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; scene.add(m); return m
    }

    // 바닥
    const floor = mesh(new THREE.PlaneGeometry(80, 80), floorMat, 0, -.03, 0); floor.rotation.x = -Math.PI/2

    // 원형 플린스 (중앙) — 패널 크기에 맞게 반경 확장
    mesh(new THREE.CylinderGeometry(5.4, 5.45, .40, 128), stone, 0, .20, 0)
    mesh(new THREE.CylinderGeometry(5.35, 5.35, .022, 128), new THREE.MeshStandardMaterial({color:'#f8f0e0', roughness:.24, map:stoneTexture}), 0, .42, 0)

    // 좌우 원형 기둥
    const colMat = new THREE.MeshStandardMaterial({color:'#f0e8d5', roughness:.72, map:stoneTexture})
    for (const [cx, cz] of [[-9.5, -2.5], [9.5, -2.5]] as [number,number][]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(.55, .58, 8.0, 32), colMat)
      col.position.set(cx, 4.0, cz); col.castShadow = true; col.receiveShadow = true; scene.add(col)
    }

    // 아치 천장 — 화면 최상단에만 살짝 보이도록 높이 올림
    const canopy = new THREE.Shape(); canopy.absarc(0, 0, 18, 0, Math.PI*2, false)
    const hole = new THREE.Path(); hole.absarc(0, 0, 13, 0, Math.PI*2, true); canopy.holes.push(hole)
    const roof = mesh(new THREE.ExtrudeGeometry(canopy, {depth:.40, bevelEnabled:false, curveSegments:96}), stone, 0, 10.5, -1)
    roof.rotation.x = -Math.PI/2

    // 오션 배경 평면
    const oceanCanvas = document.createElement('canvas'); oceanCanvas.width = 512; oceanCanvas.height = 256
    const oc = oceanCanvas.getContext('2d')!
    const oceanGrad = oc.createLinearGradient(0, 0, 0, 256)
    oceanGrad.addColorStop(0, '#7ab2cc'); oceanGrad.addColorStop(0.38, '#9ec8da')
    oceanGrad.addColorStop(0.55, '#6a9fb8'); oceanGrad.addColorStop(1, '#4e8ea8')
    oc.fillStyle = oceanGrad; oc.fillRect(0, 0, 512, 256)
    const sunR = oc.createRadialGradient(400, 70, 0, 400, 70, 190)
    sunR.addColorStop(0, 'rgba(255,225,140,0.75)'); sunR.addColorStop(0.55, 'rgba(255,200,100,0.38)'); sunR.addColorStop(1, 'rgba(255,200,100,0)')
    oc.fillStyle = sunR; oc.fillRect(0, 0, 512, 256)
    const oceanTex = new THREE.CanvasTexture(oceanCanvas); oceanTex.colorSpace = THREE.SRGBColorSpace; textures.push(oceanTex)
    const oceanMesh = new THREE.Mesh(new THREE.PlaneGeometry(110, 40), new THREE.MeshStandardMaterial({map:oceanTex, roughness:.28, metalness:.12}))
    oceanMesh.position.set(0, 3.2, -16); scene.add(oceanMesh)

    // 유리 재질 — 청색 엣지 살리되 콘텐츠 가독성 확보
    const glass = new THREE.MeshPhysicalMaterial({
      color:'#90cef5', metalness:0, roughness:.10,
      transmission:.32, thickness:.44, ior:1.52,
      envMapIntensity:2.4, clearcoat:1, clearcoatRoughness:.05
    })

    const ribbonImage = new Image(); ribbonImage.src = '/images/gallery-ribbon.webp'
    await Promise.all([document.fonts.ready, ribbonImage.decode().catch(()=>{})]); if (disposed) return

    function artwork(kind: string) {
      const c = document.createElement('canvas'); c.width = 1200; c.height = 1450; const ctx = c.getContext('2d')!
      const rounded = (x:number,y:number,w:number,h:number,r:number,color:string) => { ctx.fillStyle=color; ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fill() }
      const text = (s:string,x:number,y:number,size:number,color='#183654',weight=400) => { ctx.fillStyle=color; ctx.font=`${weight} ${size}px Pretendard, sans-serif`; ctx.fillText(s,x,y) }
      text(kind==='proposal'?'Proposal AI':kind==='design'?'UI Components':'Selected Work', 65, 105, 36, '#173653', 600)
      text(kind==='proposal'?'01 / IDEA TO PRODUCT':kind==='design'?'02 / DESIGN LANGUAGE':'03 / SELECTED WORK', 65, 155, 18, '#506e89')
      const gradient = ctx.createLinearGradient(50, 200, 1100, 1250); gradient.addColorStop(0, '#eff7fff2'); gradient.addColorStop(1, '#c8def0e8')
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.roundRect(55, 220, 1090, 1040, 16); ctx.fill()
      if (kind === 'proposal') {
        text('Proposal AI', 115, 345, 75, '#183654', 500); text('좋은 제안이,', 118, 418, 31, '#506a88'); text('더 많은 가능성을 만듭니다.', 118, 462, 31, '#506a88')
        if (ribbonImage.naturalWidth) ctx.drawImage(ribbonImage, 525, 270, 550, 750)
        rounded(115, 1010, 970, 130, 24, '#ffffffdc'); text('어떤 제안을 도와드릴까요?', 150, 1085, 29, '#6e879f')
        rounded(980, 1045, 65, 65, 33, '#346de2'); text('→', 994, 1091, 39, 'white')
        for (const [i, label] of ['제안서 조회','자료 정리','맞춤형 제안'].entries()) { rounded(120+i*315, 1170, 290, 55, 26, '#ffffff80'); text(label, 152+i*315, 1208, 22, '#57718e') }
      } else if (kind === 'design') {
        text('일관된 화면,', 115, 350, 64, '#183654', 600); text('자연스러운 경험.', 115, 430, 64, '#183654', 600)
        rounded(110, 520, 460, 320, 22, '#ffffffd9'); text('Aa', 155, 710, 150, '#183654', 500); text('Pretendard', 155, 785, 27, '#71889e')
        rounded(600, 520, 485, 320, 22, '#ffffffd9'); for (let i=0;i<4;i++) rounded(635+i*106, 615, 75, 75, 38, ['#254bb5','#457de6','#a8c7ee','#1e344c'][i]!)
        rounded(110, 870, 975, 165, 22, '#ffffffd9'); text('작은 요소가 만드는 완성도', 150, 965, 39, '#385675', 500)
        rounded(110, 1065, 460, 130, 22, '#ffffffd9'); rounded(160, 1107, 110, 48, 24, '#3d6cdb'); rounded(217, 1114, 33, 33, 17, 'white'); text('ON', 305, 1144, 28, '#57718e')
        rounded(600, 1065, 485, 130, 22, '#3263d2'); text('컴포넌트 보기  ↗', 660, 1145, 32, 'white', 600)
      } else {
        text('경험을 쌓고,', 115, 350, 64, '#183654', 600); text('가치를 만듭니다.', 115, 430, 64, '#183654', 600)
        const g = ctx.createLinearGradient(100, 550, 1000, 1000); g.addColorStop(0, '#b0cce1'); g.addColorStop(1, '#f2dfbd')
        ctx.fillStyle = g; ctx.fillRect(115, 520, 970, 500)
        ctx.strokeStyle = '#fff9ed'; ctx.lineWidth = 80; ctx.beginPath(); ctx.moveTo(280, 1020); ctx.lineTo(280, 770); ctx.bezierCurveTo(280, 540, 690, 540, 690, 770); ctx.lineTo(690, 1020); ctx.stroke()
        ctx.fillStyle = '#6b94b3'; ctx.fillRect(790, 720, 170, 300); rounded(900, 565, 95, 95, 48, '#fff9e5')
        text('현장의 문제를 화면으로 해결합니다.', 120, 1100, 31, '#385675'); text('업무 이해   /   설계   /   프론트엔드 개발', 120, 1170, 24, '#617b93')
      }
      text('CY.  —  FRONTEND · DESIGN · AI', 65, 1370, 19, '#4b6e8e')
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer!.capabilities.getMaxAnisotropy(); textures.push(t); return t
    }

    // 패널 배치 — 아트워크를 유리 뒤에 배치해 transmission으로 청색 유리 효과
    const panels = [
      {kind:'design',   x:-3.5, z:0.3, w:2.3, h:3.0, angle:0.16},
      {kind:'proposal', x: 0.1, z:1.1, w:3.4, h:4.8, angle:0},
      {kind:'projects', x: 3.8, z:0.2, w:2.6, h:3.5, angle:-0.18}
    ]
    for (const p of panels) {
      const group = new THREE.Group(); group.position.set(p.x, 0.44, p.z); group.rotation.y = p.angle; scene.add(group)
      const slab = new THREE.Mesh(new RoundedBoxGeometry(p.w, p.h, .44, 4, .038), glass)
      slab.position.y = p.h/2 + .10; group.add(slab)
      // 아트워크: 유리 앞면에 배치 — 가독성 유지, 유리 엣지에서 청색 보임
      const graphic = new THREE.Mesh(new THREE.PlaneGeometry(p.w-.08, p.h-.08), new THREE.MeshBasicMaterial({map:artwork(p.kind), transparent:true, depthWrite:false, toneMapped:false}))
      graphic.position.set(0, p.h/2+.10, .235); group.add(graphic)
      for (const x of [-p.w/2+.16, p.w/2-.16]) {
        const support = new THREE.Mesh(new RoundedBoxGeometry(.22, .22, .38, 2, .020), glass)
        support.position.set(x, .11, 0); group.add(support)
      }
    }

    const render = () => { if (!disposed && renderer) { renderer.render(scene, camera); ready.value = true } }
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return
      renderer!.setSize(w, h); camera.aspect = w/h
      if (w < 740) { camera.position.set(0, 5.0, 17); camera.lookAt(0, 3.4, 0) }
      else { camera.position.set(0, 4.6, 11.5); camera.lookAt(0, 3.4, 0) }
      camera.updateProjectionMatrix(); render()
    }
    observer = new ResizeObserver(resize); observer.observe(el); resize()
    renderer.domElement.addEventListener('webglcontextlost', () => { failed.value=true; ready.value=false })
  } catch(error) { console.error('Studio render failed', error); failed.value = true; cleanup() }
})
onBeforeUnmount(() => cleanup())
</script>
<template><div ref="host" class="story-world"><p v-if="failed" class="render-status">이 환경에서는 3D 화면을 표시할 수 없습니다.</p><p v-else-if="!ready" class="render-status">스튜디오를 준비하고 있습니다</p></div></template>
<style scoped>.story-world{position:absolute;inset:0}.story-world :deep(canvas){display:block;width:100%;height:100%}.render-status{position:absolute;right:10%;top:50%;font-size:14px;color:#29445f}.render-status span{display:block}</style>
