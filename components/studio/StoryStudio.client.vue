<script setup lang="ts">
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const host = ref<HTMLDivElement>()
const artwork = ref<HTMLDivElement>()
const ready = ref(false)
const failed = ref(false)
const selected = ref(0)
const exhibits = [
  { title: 'Proposal AI', href: '/work/proposal-agent' },
  { title: 'UI Components', href: '/projects/ispark-ui' },
  { title: 'Selected Work', href: '/projects' },
]
let renderScene = () => {}
function choose(index: number) {
  if (!ready.value) return
  selected.value = (index + exhibits.length) % exhibits.length
  renderScene()
}
let dispose = () => {}

onMounted(async () => {
  await nextTick()
  const el = host.value
  const source = artwork.value
  if (!el || !source) return
  const scene = new THREE.Scene()
  const textures: THREE.Texture[] = []
  const geometries: THREE.BufferGeometry[] = []
  const materials: THREE.Material[] = []
  let renderer: THREE.WebGLRenderer | undefined
  let panelLayer: HTMLDivElement | undefined
  let observer: ResizeObserver | undefined
  let environment: THREE.WebGLRenderTarget | undefined
  let cancelled = false
  const elements = Array.from(source.children) as HTMLElement[]
  const onLost = (event: Event) => { event.preventDefault(); dispose(); failed.value = true; ready.value = false }
  dispose = () => {
    cancelled = true
    renderScene = () => {}
    observer?.disconnect()
    elements.forEach(element => { element.removeAttribute('style'); source.appendChild(element) })
    geometries.forEach(geometry => geometry.dispose())
    materials.forEach(material => material.dispose())
    textures.forEach(texture => texture.dispose())
    environment?.dispose()
    renderer?.domElement.removeEventListener('webglcontextlost', onLost)
    renderer?.dispose()
    renderer?.domElement.remove()
    panelLayer?.remove()
  }
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.NoToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.addEventListener('webglcontextlost', onLost)
    el.appendChild(renderer.domElement)
    panelLayer = document.createElement('div')
    panelLayer.className = 'panel-dom'
    el.appendChild(panelLayer)

    // Fixed-camera architectural plate; this is not a reconstructed building.
    const plate = await new THREE.TextureLoader().loadAsync('/images/studio-study/architecture.webp')
    if (cancelled) { plate.dispose(); return }
    plate.colorSpace = THREE.SRGBColorSpace
    textures.push(plate)
    scene.background = plate

    // Approximate the plate's sky, warm floor and broad window reflections.
    const lighting = new THREE.Scene()
    const sky = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), new THREE.MeshBasicMaterial({ color: '#c7dcec', side: THREE.BackSide }))
    lighting.add(sky)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: '#c6b49b', side: THREE.DoubleSide }))
    floor.rotation.x = -Math.PI / 2; floor.position.y = -8; lighting.add(floor)
    for (const [x, y, z, w, h, color] of [
      [-18, 9, 14, 8, 30, '#ffffff'], [16, 14, 8, 4, 35, '#eaf4ff'], [0, 24, -8, 45, 4, '#fff5e3'],
    ] as const) {
      const card = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }))
      card.position.set(x, y, z); card.lookAt(0, 0, 0); lighting.add(card)
    }
    const pmrem = new THREE.PMREMGenerator(renderer)
    environment = pmrem.fromScene(lighting, .035, .1, 200)
    scene.environment = environment.texture
    pmrem.dispose()
    lighting.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); object.material.dispose() } })
    scene.add(new THREE.HemisphereLight('#edf6ff', '#b9a183', 1.7))
    const sun = new THREE.DirectionalLight('#fff4e0', 2.2)
    sun.position.set(-700, 500, 700); scene.add(sun)

    const glass = new THREE.MeshPhysicalMaterial({
      color: '#e3f2ff', metalness: 0, roughness: .075, transmission: 1,
      thickness: 7, ior: 1.46, attenuationColor: new THREE.Color('#77b8ff'),
      attenuationDistance: 160, envMapIntensity: .65, clearcoat: 1, clearcoatRoughness: .055,
    })
    const edge = new THREE.MeshBasicMaterial({ color: '#225b9f', transparent: true, opacity: .82 })
    const glint = new THREE.MeshBasicMaterial({ color: '#edf9ff', transparent: true, opacity: .9 })
    materials.push(glass, edge, glint)

    // Screen-space proportions measured from the 1536 × 578 reference hero.
    const specs = [
      { x: 692, bottom: 425, w: 172, h: 255, yaw: -.35 },
      { x: 944, bottom: 455, w: 334, h: 355, yaw: -.4 },
      { x: 1262, bottom: 438, w: 247, h: 294, yaw: .19 },
    ]
    const panels = specs.map((spec, index) => {
      const group = new THREE.Group(); scene.add(group)
      const geometry = new RoundedBoxGeometry(spec.w, spec.h, 6, 4, 1.6)
      geometries.push(geometry)
      group.add(new THREE.Mesh(geometry, glass))
      // Polished front and rear perimeters emphasize the slab's real thickness.
      for (const z of [-2.4, 2.4]) {
        for (const sign of [-1, 1]) {
          const vertical = new THREE.CylinderGeometry(.65, .65, spec.h - 3, 8)
          const horizontal = new THREE.CylinderGeometry(.65, .65, spec.w - 3, 8)
          geometries.push(vertical, horizontal)
          const v = new THREE.Mesh(vertical, z > 0 && sign < 0 ? glint : edge)
          v.position.set(sign * (spec.w / 2 - .8), 0, z); group.add(v)
          const h = new THREE.Mesh(horizontal, z > 0 && sign > 0 ? glint : edge)
          h.rotation.z = Math.PI / 2; h.position.set(0, sign * (spec.h / 2 - .8), z); group.add(h)
        }
      }
      const element = elements[index]!
      panelLayer!.appendChild(element)
      return { group, element, spec }
    })

    const camera = new THREE.PerspectiveCamera(30, 1, 1, 5000)
    camera.position.z = 1000
    const render = () => {
      if (cancelled || failed.value) return
      const w = el.clientWidth, h = el.clientHeight
      if (!w || !h) return
      const mobile = w < 760
      const scale = mobile ? w / 850 : w / 1536
      const vertical = mobile ? scale : Math.min(h / 578, scale * 1.25)
      const baseline = mobile ? h * .735 : h * .755
      const visibleWidth = mobile ? (w / h) / (8 / 3) : 1
      plate.repeat.set(visibleWidth, .95)
      plate.offset.set((1 - visibleWidth) * .65, .05)
      renderer!.setSize(w, h)
      camera.aspect = w / h
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(h / 2000))
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
      panels.forEach(({ group, element, spec }, index) => {
        const slotIndex = (index + selected.value) % specs.length
        const slot = specs[slotIndex]!
        const x = mobile ? (slot.x - 600) * scale + w * .08 : slot.x * scale
        const bottom = baseline + (slot.bottom - 445) * vertical
        group.position.set(x - w / 2, h / 2 - bottom + slot.h * vertical / 2, 0)
        group.rotation.y = slot.yaw
        group.scale.set(scale * slot.w / spec.w, vertical * slot.h / spec.h, scale)
        element.classList.toggle('is-featured', slotIndex === 1)
        element.classList.toggle('is-side', slotIndex !== 1)
        group.updateMatrixWorld()
        const project = (x: number, y: number) => {
          const point = new THREE.Vector3(x, y, 3.7).applyMatrix4(group.matrixWorld).project(camera)
          return { x: (point.x + 1) * w / 2, y: (1 - point.y) * h / 2 }
        }
        const tl = project(-spec.w / 2, spec.h / 2)
        const tr = project(spec.w / 2, spec.h / 2)
        const bl = project(-spec.w / 2, -spec.h / 2)
        const br = project(spec.w / 2, -spec.h / 2)
        // Keep the glass in perspective, but rasterize text at its final screen size.
        // Integer bounds inside the four corners avoid scaled/rotated glyph textures.
        const left = Math.ceil(Math.max(tl.x, bl.x)) + 4
        const top = Math.ceil(Math.max(tl.y, tr.y)) + 4
        Object.assign(element.style, {
          left: `${left}px`, top: `${top}px`,
          width: `${Math.floor(Math.min(tr.x, br.x)) - left - 4}px`,
          height: `${Math.floor(Math.min(bl.y, br.y)) - top - 4}px`,
        })
        const shadow = el.querySelector<HTMLElement>(`.contact-${index}`)
        if (shadow) {
          group.updateMatrixWorld()
          const points = [-1, 1].map(sign => {
            const point = new THREE.Vector3(sign * spec.w / 2, -spec.h / 2, 0).applyMatrix4(group.matrixWorld).project(camera)
            return { x: (point.x + 1) * w / 2, y: (1 - point.y) * h / 2 }
          })
          const [a, b] = points as [{ x: number; y: number }, { x: number; y: number }]
          shadow.style.left = `${(a.x + b.x) / 2}px`; shadow.style.top = `${(a.y + b.y) / 2}px`
          shadow.style.width = `${Math.hypot(b.x - a.x, b.y - a.y)}px`
          shadow.style.transform = `translate(-50%, -30%) rotate(${Math.atan2(b.y - a.y, b.x - a.x)}rad)`
        }
      })
      renderer!.render(scene, camera)
      ready.value = true
    }
    renderScene = render
    observer = new ResizeObserver(render); observer.observe(el); render()
  } catch (error) {
    console.error('Studio rendering failed', error)
    dispose(); failed.value = true; ready.value = false
  }
})
onBeforeUnmount(() => dispose())
</script>

<template>
  <div ref="host" class="story-world" :class="{ 'is-ready': ready, 'has-failed': failed }" :data-render-state="failed ? 'fallback' : ready ? 'ready' : 'loading'">
    <div v-for="index in 3" :key="index" class="contact-shadow" :class="`contact-${index - 1}`" aria-hidden="true" />
    <div ref="artwork" class="artwork-source">
      <article class="panel-art design-art" aria-label="UI 컴포넌트 디자인 미리보기">
        <h2><span class="desktop-copy">UI Components</span><span class="mobile-copy">UI Kit</span></h2>
        <div class="swatches" aria-label="파란색과 뉴트럴 색상 팔레트"><i v-for="color in ['#234778', '#3263a9', '#94b8e0', '#cbd7e2', '#f4f6f6']" :key="color" :style="{ background: color }" /></div>
        <div class="mini-buttons" aria-hidden="true"><span>Reset</span><span>Button</span><span>○ &nbsp;●</span></div>
        <div class="component-grid" aria-hidden="true"><div class="mini-menu"><span>Overview <b>›</b></span><span>Projects <b>›</b></span><span>Design files <b>›</b></span><span>Settings <b>›</b></span></div><div class="type-card"><span>Aa</span><small>PRETENDARD & SERIF</small></div></div>
        <p class="panel-caption">작은 요소부터, 일관된 경험으로.</p>
      </article>
      <article class="panel-art proposal-art" aria-label="Proposal AI 서비스 디자인 미리보기">
        <div class="proposal-heading"><h2>Proposal AI</h2><p>좋은 제안이,<br><span class="desktop-copy">더 많은 가능성을 만듭니다.</span><span class="mobile-copy">가능성을 만듭니다.</span></p></div>
        <img class="proposal-wave" src="/images/studio-study/glass-wave.webp" alt="" />
        <div class="proposal-composer"><div class="prompt-preview"><span>어떤 제안을 도와드릴까요?</span><span class="send-mark" aria-hidden="true">→</span></div><div class="suggestions"><span>제안서 초안</span><span>자료 정리</span><span>맞춤형 제안</span><span>톤앤매너</span></div></div>
      </article>
      <article class="panel-art brand-art" aria-label="브랜드 웹 디자인 콘셉트 미리보기">
        <div class="brand-visual"><img src="/images/gallery-reference-background.webp" alt="바다를 바라보는 밝은 석재 건축 공간"/><div class="brand-copy"><h2>브랜드의<br>가능성을<span class="desktop-copy"> 구체적인</span><br>경험으로</h2><span>View Project →</span></div></div>
        <div class="brand-thumbnails" aria-hidden="true"><img v-for="position in ['18%', '55%', '88%']" :key="position" src="/images/gallery-reference-background.webp" alt="" :style="{ objectPosition: position }"/></div>
      </article>
    </div>
    <p v-if="failed" class="render-status" role="status">정지 이미지와 UI로 표시하고 있습니다.</p>
    <nav class="studio-controls" aria-label="작업 슬라이드" @keydown.left.prevent="choose(selected - 1)" @keydown.right.prevent="choose(selected + 1)">
      <button type="button" class="slide-arrow" aria-label="이전 프로젝트" :disabled="!ready" @click="choose(selected - 1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7M8 12h12" /></svg></button>
      <div class="slide-dots"><button v-for="(exhibit, index) in exhibits" :key="exhibit.title" type="button" :aria-label="`${exhibit.title} 선택`" :aria-current="selected === index ? 'true' : undefined" :disabled="!ready" @click="choose(index)"><span /></button></div>
      <button type="button" class="slide-arrow" aria-label="다음 프로젝트" :disabled="!ready" @click="choose(selected + 1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7M4 12h12" /></svg></button>
      <p class="slide-caption" aria-live="polite"><NuxtLink :to="exhibits[selected]!.href">{{ exhibits[selected]!.title }} <span aria-hidden="true">↗</span></NuxtLink></p>
    </nav>
  </div>
</template>

<style scoped>
.story-world{position:absolute;inset:0;pointer-events:none}
.story-world :deep(canvas),.story-world :deep(.panel-dom){position:absolute;inset:0;display:block}
.story-world :deep(.panel-dom){z-index:2;pointer-events:none!important}
.story-world :deep(canvas){opacity:0}.is-ready :deep(canvas){opacity:1}
.artwork-source{position:absolute;inset:0;visibility:hidden}
.panel-art{position:absolute;box-sizing:border-box;color:#112747;overflow:hidden;pointer-events:none!important;border-radius:3px;background:linear-gradient(130deg,#d9edff24,#cde4ff48 52%,#b2d7fc35);font-family:var(--studio-font-sans);font-weight:400;line-height:1.5}
.panel-art h2,.panel-art p{margin:0;font-weight:400}
.proposal-art{background:linear-gradient(130deg,#edf6ff24,#9ecbfa7a 70%,#dcecff40)}
.proposal-heading{position:absolute;left:40px;top:66px;z-index:1}.proposal-heading h2{font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:-1px;line-height:1.1}.proposal-heading p{font-size:12px;line-height:1.5;margin-top:12px;color:#42658d}
.proposal-wave{position:absolute;width:150%;max-width:none;height:88%;object-fit:fill;left:-25%;top:6%;opacity:.83}
.proposal-composer{position:absolute;bottom:25px;left:26px;right:26px;border:1px solid #ffffffb0;border-radius:13px;background:#f6f9ff7a;box-shadow:0 6px 22px #1e5ea313;padding:0 0 8px}
.prompt-preview{height:55px;background:#f8fbffb3;display:flex;align-items:center;justify-content:space-between;padding:0 13px;border-radius:12px 12px 8px 8px;color:#5f7fa6;font-size:10px}
.send-mark{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;color:white;background:#3478df;border:1px solid #2260bd;box-shadow:inset 0 0 0 1px #ffffff38;font-size:22px;font-weight:200}
.suggestions{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:7px 8px 0}.suggestions span{font-size:11px;line-height:1.4;color:#385476;border:1px solid #ffffffa0;background:#ffffff70;border-radius:15px;padding:4px 5px;text-align:center;white-space:nowrap}
.design-art{padding:25px 11px 15px}.design-art h2{font:12px Georgia,serif;letter-spacing:-.3px;margin-bottom:25px}.swatches{display:flex;justify-content:space-between;padding:0 4px;margin-bottom:19px}.swatches i{width:16px;height:19px;border:1px solid #ffffff80;border-radius:50%;box-shadow:0 2px 3px #1b416914}.mini-buttons{display:flex;gap:6px;margin-bottom:14px}.mini-buttons span{flex:1;text-align:center;font-size:9px;background:#ffffffb0;border:1px solid #fff9;border-radius:5px;padding:5px 0;color:#6a7891}.mini-buttons span:nth-child(2){background:#28599c;color:white;border-color:#295795}.component-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:8px}.mini-menu{display:flex;flex-direction:column;gap:4px}.mini-menu span{font-size:9px;color:#5f738a;background:#f6faff9c;border:1px solid #ffffff70;border-radius:3px;padding:7px 4px}.mini-menu b{float:right;font-weight:400}.type-card{display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f4faff8c;border:1px solid #fff8;border-radius:4px}.type-card>span{font:35px Georgia,serif}.type-card small{font-size:8px;color:#56718f;margin-top:7px}.panel-caption{font-size:10px!important;color:#55708c;margin-top:14px!important}
.brand-art{padding:22px 15px 20px}.brand-visual{height:77%;position:relative;overflow:hidden;border-radius:4px;background:#eee8df}.brand-visual>img{width:100%;height:100%;object-fit:cover;object-position:64%;filter:saturate(.7)}.brand-copy{position:absolute;inset:0;background:linear-gradient(90deg,#f3efe9db,transparent 85%);padding:48px 15px 10px}.brand-copy h2{font-size:13px;line-height:1.4;font-weight:500;letter-spacing:-.4px}.brand-copy>span{position:absolute;bottom:12px;font-size:10px}.brand-thumbnails{display:flex;gap:4px;margin-top:10px;height:21%}.brand-thumbnails img{width:calc((100% - 8px)/3);height:100%;object-fit:cover;border:1px solid #ffffffb0}
.contact-shadow{position:absolute;height:9px;transform:translate(-50%,-35%);border-radius:50%;background:#203e60;filter:blur(3px);opacity:0;z-index:1;box-shadow:10px 5px 12px #34445b38}.is-ready .contact-shadow{opacity:.38}
.render-status{position:absolute;bottom:42px;left:20px;font-size:12px;color:#253c52}
.has-failed .artwork-source{visibility:visible}.has-failed .panel-art{position:absolute;top:25%;height:44%;background:#d4e7f5c9;border:1px solid #5280b9;box-shadow:2px 3px 0 #bdd5f5}.has-failed .design-art{left:40%;width:11%}.has-failed .proposal-art{left:52%;width:21%;top:14%;height:64%}.has-failed .brand-art{left:75%;width:15%;height:50%}
@media(max-width:759px){.has-failed .design-art{left:5%;width:20%;top:55%;height:24%}.has-failed .proposal-art{left:27%;width:40%;top:45%;height:35%}.has-failed .brand-art{left:70%;width:25%;top:51%;height:28%}}

/* Small panels show a legible summary instead of shrinking the entire desktop UI. */
.mobile-copy{display:none}
.studio-controls{position:absolute;left:65%;bottom:8%;z-index:4;display:flex;align-items:center;gap:12px;transform:translateX(-50%);pointer-events:auto;color:#25415f}
.studio-controls button{display:grid;place-items:center;padding:0;cursor:pointer;color:inherit;background:transparent;font:inherit}
.slide-arrow{width:44px;height:44px;border:1px solid #48607850;border-radius:50%;background:#f6faff45!important;backdrop-filter:blur(4px)}
.slide-arrow:hover{background:#ffffffb0!important}.slide-arrow svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.slide-dots{display:flex;gap:3px}.slide-dots button{width:35px;height:44px;border:0}.slide-dots span{width:7px;height:7px;border-radius:8px;background:#8196ad70}.slide-dots [aria-current="true"] span{width:24px;background:#315ed6}
.studio-controls button:disabled{cursor:default;opacity:.4}.slide-caption{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin:5px 0 0;font-size:11px;white-space:nowrap}.slide-caption a{color:inherit;text-decoration:none}.slide-caption a:hover{text-decoration:underline}
.proposal-art.is-side .proposal-heading{left:10px;top:24px}.proposal-art.is-side .proposal-heading h2{font-size:18px;letter-spacing:-.6px}.proposal-art.is-side .proposal-heading p{font-size:10px;line-height:1.6}.proposal-art.is-side .suggestions{display:none}.proposal-art.is-side .prompt-preview{font-size:10px;padding:0 6px;gap:4px}.proposal-art.is-side .send-mark{width:22px;height:22px;font-size:16px}.proposal-art.is-side .proposal-composer{padding:0;bottom:12px}
.design-art.is-featured{padding:35px 24px}.design-art.is-featured h2{font-size:24px;margin-bottom:25px}.design-art.is-featured .swatches{max-width:220px;margin-bottom:24px}.design-art.is-featured .swatches i{width:24px;height:28px}.design-art.is-featured .mini-menu span{font-size:12px;padding:8px}.design-art.is-featured .mini-buttons span{font-size:11px}.design-art.is-featured .type-card>span{font-size:48px}.brand-art.is-featured .brand-copy h2{font-size:19px}
.proposal-heading{left:10%;top:14%}
.proposal-heading p{color:#344f70}
.proposal-composer{left:7%;right:7%;bottom:6%}
.prompt-preview{font-size:12px;gap:8px;color:#385476}
.prompt-preview>span:first-child{min-width:0}
.send-mark{flex-shrink:0}
.design-art{padding:20px 10px 10px}
.design-art h2{font-size:14px;margin-bottom:17px}
.swatches{margin-bottom:15px}
.mini-buttons{gap:4px;margin-bottom:10px}
.mini-menu span{padding:5px 4px;white-space:nowrap}
.component-grid{grid-template-columns:1.3fr .7fr;gap:5px}
.type-card small{display:none}
.panel-caption{margin-top:9px!important;line-height:1.5}
@media(max-width:1100px){.panel-caption{display:none}.design-art h2{font-size:12px}.mini-menu span{font-size:9px}.proposal-heading h2{font-size:24px}.proposal-heading p{font-size:11px}.suggestions span{font-size:10px}.prompt-preview{font-size:11px;padding:0 8px}.brand-copy{padding:28px 8px 8px}.brand-copy h2{font-size:12px}}
@media(max-width:759px){
  .studio-controls{left:50%;bottom:10%;gap:10px}.slide-caption{font-size:11px}
  .design-art.is-featured{padding:20px 12px}.design-art.is-featured h2{font-size:17px;margin-bottom:16px}.design-art.is-featured .swatches{margin-bottom:15px}.design-art.is-featured .swatches i{width:14px;height:17px}.design-art.is-featured .type-card{height:45px}.design-art.is-featured .type-card>span{font-size:32px}
  .brand-art.is-featured .brand-copy h2{font-size:15px}.proposal-art.is-side .proposal-heading h2{font-size:11px}.proposal-art.is-side .proposal-heading{left:6px;right:4px;top:14px}.proposal-art.is-side .proposal-heading p,.proposal-art.is-side .proposal-composer{display:none}
  .desktop-copy{display:none}.mobile-copy{display:inline}
  .design-art{padding:12px 7px}.design-art h2{font-size:11px;line-height:1.5;margin-bottom:10px}
  .swatches{gap:3px;padding:0;margin-bottom:10px}.swatches i{width:7px;height:9px;flex-shrink:0}
  .mini-buttons,.mini-menu,.panel-caption,.suggestions{display:none}.component-grid{display:block}.type-card{height:27px}.type-card>span{font-size:22px}
  .proposal-heading{left:10px;right:8px;top:14px}.proposal-heading h2{font-size:17px;letter-spacing:-.5px}.proposal-heading p{font-size:10px;line-height:1.6;margin-top:8px}
  .proposal-composer{bottom:10px;left:8px;right:8px;padding:0;border-radius:8px}.prompt-preview{height:42px;font-size:10px;padding:0 7px;border-radius:8px;gap:4px}.send-mark{width:20px;height:20px;font-size:16px}
  .brand-art{padding:12px 7px}.brand-copy{padding:16px 5px 5px}.brand-copy h2{font-size:11px;line-height:1.5;letter-spacing:-.5px}.brand-copy>span{display:none}.brand-thumbnails{gap:3px;margin-top:5px}
}
</style>
