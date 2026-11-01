<script setup lang="ts">
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
import { UiButton } from '@leechanyong/ispark-ui'
const exhibits = [
  { title: '제안서 AI 에이전트', kind: 'proposal' },
  { title: '디자인 시스템', kind: 'design' },
  { title: '프로젝트', kind: 'projects' },
]
const host = ref<HTMLDivElement>()
const selected = ref(0)
const ready = ref(false)
let target = 0
let current = 0
let destroyed = false
let frame = 0
let dispose = () => {}
const step = Math.PI * 2 / exhibits.length
const reduceMotion = ref(false)
function choose(index: number) {
  // Find the shortest route while preserving seamless full-circle rotation.
  let delta = -index * step - target
  delta = Math.atan2(Math.sin(delta), Math.cos(delta))
  target += delta
  selected.value = index
}
function next(direction: number) {
  target -= direction * step
  selected.value = ((Math.round(-target / step) % exhibits.length) + exhibits.length) % exhibits.length
}
onMounted(async () => {
  await nextTick()
  const el = host.value
  if (!el) return
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = media.matches
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 1, 4000)
  const renderer = new CSS3DRenderer()
  renderer.domElement.className = 'orbit-renderer'
  el.appendChild(renderer.domElement)
  const cards: CSS3DObject[] = []
  const links: HTMLButtonElement[] = []
  const cleanup: (() => void)[] = []
  const listen = (node: EventTarget, event: string, fn: EventListener) => { node.addEventListener(event, fn); cleanup.push(() => node.removeEventListener(event, fn)) }
  let dragged = false
  let drag: { startX: number; startAngle: number; pointer: number } | null = null
  exhibits.forEach((item, index) => {
    const card = document.createElement('article')
    card.className = 'orbit-card'
    const link = document.createElement('button')
    link.type = 'button'; link.className = 'glass-panel'
    link.setAttribute('aria-label', `${item.title} 앞으로 가져오기`)
    const heading = document.createElement('div'); heading.className = 'glass-heading'
    const title = document.createElement('span'); title.textContent = item.title
    const indexLabel = document.createElement('small'); indexLabel.textContent = `0${index + 1} / CY STUDIO`
    heading.append(title, indexLabel)
    const preview = document.createElement('div'); preview.className = `glass-preview preview-${item.kind}`
    // Decorative UI compositions, not screenshots of the user's work.
    const compositions = {
      proposal: `<aside><b>CY</b><i></i><i></i><i></i><i></i></aside><div class="ai-cover"><small>IDEA TO PROPOSAL</small><h3>AI와 함께,<br>더 좋은 제안서를.</h3><p>생각을 연결하고, 가능성을 펼칩니다.</p><img class="ribbon-art" src="/images/gallery-ribbon.webp" alt="" draggable="false"><div class="prompt-bar">어떤 제안을 시작할까요?<b>↑</b></div><div class="prompt-tags"><span>중점 찾기</span><span>스토리 구상</span><span>목차 구성</span></div></div>`,
      design: `<div class="design-cover"><small>THE DESIGN LANGUAGE</small><h3>작은 요소에서,<br>완성된 경험으로.</h3><div class="design-tiles"><div class="type-tile">Aa<small>Pretendard</small></div><div class="swatch-tile"><i></i><i></i><i></i></div><div class="line-tile"><i></i><i></i><i></i></div><div class="control-tile"><i></i><b>↗</b></div></div><div class="sample-button">자연스럽게 이어지는 UI <b>→</b></div></div>`,
      projects: `<div class="projects-cover"><small>SELECTED WORKS</small><h3>경험을 쌓고,<br>가치를 만듭니다.</h3><div class="editorial-art"><div class="arch"></div><div class="stone"></div><div class="sun"></div></div><div class="project-meta"><span>DESIGN & DEVELOPMENT</span><b>↗</b></div></div>`,
    }
    preview.innerHTML = compositions[item.kind as keyof typeof compositions]
    const foot = document.createElement('div'); foot.className = 'glass-foot'; foot.textContent = 'FRONTEND · DESIGN · AI'
    const base = document.createElement('div'); base.className = 'glass-base'; base.innerHTML = '<i></i><i></i><i></i>'; link.append(heading, preview, foot, base); card.append(link)
    listen(link, 'click', ((event: MouseEvent) => {
      if (dragged) { event.preventDefault(); return }
      choose(index)
    }) as EventListener)
    const object = new CSS3DObject(card); scene.add(object); cards.push(object); links.push(link)
  })
  const resize = () => {
    const width = el.clientWidth, height = el.clientHeight
    renderer.setSize(width, height); camera.aspect = width / height
    camera.position.set(0, 45, width < 600 ? 1600 : 1210)
    camera.lookAt(0, 0, 0); camera.updateProjectionMatrix()
  }
  const observer = new ResizeObserver(resize); observer.observe(el); resize()
  listen(el, 'pointerdown', ((event: PointerEvent) => {
    if (event.button !== 0) return
    dragged = false; drag = { startX: event.clientX, startAngle: target, pointer: event.pointerId }
  }) as EventListener)
  listen(window, 'pointermove', ((event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointer) return
    const dx = event.clientX - drag.startX
    if (Math.abs(dx) > 6) dragged = true
    if (dragged) target = drag.startAngle + dx * .006
  }) as EventListener)
  const release = () => {
    if (!drag) return
    drag = null
    if (dragged) { target = Math.round(target / step) * step; selected.value = ((Math.round(-target / step) % exhibits.length) + exhibits.length) % exhibits.length }
  }
  listen(window, 'pointerup', release)
  listen(window, 'pointercancel', release)
  listen(el, 'dragstart', ((event: Event) => event.preventDefault()))
  listen(media, 'change', (() => { reduceMotion.value = media.matches }))
  let last = performance.now()
  const render = (now: number) => {
    if (destroyed) return
    const dt = Math.min((now - last) / 1000, .05); last = now
    current = reduceMotion.value ? target : THREE.MathUtils.lerp(current, target, 1 - Math.exp(-dt * 6))
    cards.forEach((object, index) => {
      const angle = current + index * step
      const depth = (Math.cos(angle) + 1) / 2
      object.position.set(-Math.sin(angle) * 640, -235 + depth * 185, Math.cos(angle) * 390)
      object.rotation.y = -.14 - Math.sin(angle) * .2
      object.rotation.z = .045 * depth
      object.scale.setScalar(.64 + depth * .24)
      const front = index === selected.value
      object.element.classList.toggle('is-front', front)
      object.element.style.opacity = '1'
      object.element.style.filter = 'none'
      links[index]!.tabIndex = front ? 0 : -1
      object.element.setAttribute('aria-hidden', front ? 'false' : 'true')
    })
    renderer.render(scene, camera)
    if (!document.hidden) frame = requestAnimationFrame(render)
  }
  listen(document, 'visibilitychange', (() => { cancelAnimationFrame(frame); if (!document.hidden) { last = performance.now(); frame = requestAnimationFrame(render) } }))
  frame = requestAnimationFrame(render); ready.value = true
  dispose = () => { destroyed = true; cancelAnimationFrame(frame); observer.disconnect(); cleanup.forEach(fn => fn()); renderer.domElement.remove() }
})
onBeforeUnmount(() => dispose())
</script>
<template>
  <section class="orbit-gallery" aria-label="원형 회전 아트 갤러리" aria-roledescription="캐러셀" @keydown.left.prevent="next(-1)" @keydown.right.prevent="next(1)">
    <div ref="host" class="orbit-stage" />
    <nav class="orbit-controls" aria-label="전시대 회전">
      <UiButton class="orbit-arrow" variant="secondary" size="xlg" aria-label="이전 프로젝트로 회전" @click="next(-1)">←</UiButton>
      <div class="orbit-pager"><button v-for="(item,i) in exhibits" :key="item.title" :aria-label="`${item.title} 앞으로 가져오기`" :aria-current="selected === i ? 'true' : undefined" @click="choose(i)"><span /></button></div>
      <UiButton class="orbit-arrow" variant="secondary" size="xlg" aria-label="다음 프로젝트로 회전" @click="next(1)">→</UiButton>
    </nav>
    <p class="orbit-caption" aria-live="polite"><strong>{{ exhibits[selected]!.title }}</strong><span>드래그하거나 화살표를 눌러 돌려보세요</span></p>
    <p v-if="!ready" class="orbit-fallback">갤러리를 불러오는 중입니다</p>
  </section>
</template>
<style scoped>
.orbit-gallery { position:absolute; left:25%; right:5%; top:13%; bottom:9%; z-index:1; }
.orbit-stage { width:100%; height:calc(100% - 80px); cursor:grab; touch-action:pan-y; user-select:none; }.orbit-stage:active { cursor:grabbing; }
.orbit-stage :deep(.orbit-renderer) { overflow:visible!important; }
.orbit-stage :deep(.orbit-card) { width:480px; height:410px; backface-visibility:hidden; }
.orbit-stage :deep(.glass-panel) { position:relative; display:flex; flex-direction:column; width:100%; height:100%; padding:28px 26px 18px; text-align:left; color:#173556; border:1px solid #eff8ff; border-right:3px solid #73a3d6; border-radius:5px; background:linear-gradient(115deg,#d7ebff80 0%,#75a3e04d 45%,#4c8cda66 100%); box-shadow:inset 1px 0 0 #fff, inset -7px 0 14px #4c8cd22b,8px 5px 0 -3px #93b7dc85,0 28px 30px -20px #27477480; cursor:grab; -webkit-tap-highlight-color:transparent; }
.orbit-stage :deep(.glass-panel::after) { content:''; position:absolute; left:14px; right:14px; height:21px; bottom:-8px; border:1px solid #b9d8ffb3; background:linear-gradient(100deg,#e6f3ff7a,#6f9ece80,#ecf7ff90); box-shadow:0 10px 9px #31577b21; transform:skewX(-17deg); }
.orbit-stage :deep(.glass-panel:focus-visible) { outline:2px solid #315fd1; outline-offset:8px; }
.orbit-stage :deep(.glass-heading) { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; font-size:16px; font-weight:650; letter-spacing:-.04em; }
.orbit-stage :deep(.glass-heading small) { font-size:6px; letter-spacing:.08em; font-weight:400; }
.orbit-stage :deep(.glass-preview) { position:relative; isolation:isolate; flex-shrink:0; width:100%; height:285px; background:linear-gradient(125deg,#e6f0fc 0%,#d8e8fa 54%,#c6dcf3 100%); border:1px solid #ecf6ff; box-shadow:inset 0 1px 0 #ffffffcf,inset -1px -1px 0 #89b1d866,0 9px 18px #153c7f18; border-radius:2px; overflow:hidden; pointer-events:none; }
.orbit-stage :deep(.glass-preview::after) { content:''; position:absolute; inset:0; z-index:3; pointer-events:none; background:linear-gradient(115deg,transparent 8%,#ffffff20 20%,#ffffff50 23%,#ffffff0a 29%,transparent 39%,#ffffff16 80%,transparent 95%); box-shadow:inset 0 0 14px #ecf7ff38; }
.orbit-stage :deep(.glass-foot) { margin-top:auto; font-size:6px; letter-spacing:.24em; opacity:.7; }
.orbit-stage :deep(.preview-proposal) { display:flex; }
.orbit-stage :deep(aside) { width:49px; flex-shrink:0; background:#263449; padding:16px 8px; color:white; }
.orbit-stage :deep(aside b) { font-size:10px; }
.orbit-stage :deep(aside i) { display:block; width:19px; height:2px; background:#b5c8e457; margin-top:22px; }
.orbit-stage :deep(.ai-cover) { position:relative; flex:1; padding:27px 24px; overflow:hidden; }
.orbit-stage :deep(.ai-cover>small),.orbit-stage :deep(.design-cover>small),.orbit-stage :deep(.projects-cover>small) { font-size:6px; letter-spacing:.18em; color:#6c80a1; }
.orbit-stage :deep(h3) { font-size:22px; line-height:1.4; letter-spacing:-.065em; margin:17px 0 8px; font-weight:650; position:relative; z-index:1; }
.orbit-stage :deep(.ai-cover p) { font-size:6px; color:#74849b; position:relative; z-index:1; }
.orbit-stage :deep(.ribbon-art) { position:absolute; top:0; right:0; width:157px; height:223px; object-fit:contain; pointer-events:none; opacity:.85; }
.orbit-stage :deep(.prompt-bar) { position:relative; margin-top:62px; background:white; border:1px solid #dae3f6; border-radius:20px; padding:10px; font-size:7px; box-shadow:0 4px 12px #597db815; display:flex; align-items:center; justify-content:space-between; }
.orbit-stage :deep(.prompt-bar b) { display:grid; place-items:center; background:#416be9; color:#fff; width:16px; height:16px; border-radius:50%; font-size:10px; }
.orbit-stage :deep(.prompt-tags) { display:flex; gap:7px; margin-top:8px; font-size:5px; color:#6d7f9a; }.orbit-stage :deep(.prompt-tags span) { padding:3px 6px; border:1px solid #dfe6f1; border-radius:8px; }
.orbit-stage :deep(.design-cover),.orbit-stage :deep(.projects-cover) { padding:28px; }
.orbit-stage :deep(.design-tiles) { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:16px; }.orbit-stage :deep(.design-tiles>div) { background:#fff; border:1px solid #e1e7f1; border-radius:5px; padding:11px; height:48px; }
.orbit-stage :deep(.type-tile) { font-size:23px; line-height:20px; }.orbit-stage :deep(.type-tile small) { font-size:5px; display:block; color:#8191a6; }
.orbit-stage :deep(.swatch-tile) { display:flex; align-items:center; gap:3px; }.orbit-stage :deep(.swatch-tile i) { width:18px; height:18px; background:#2f59d4; border-radius:50%; }.orbit-stage :deep(.swatch-tile i:nth-child(2)) { background:#a1bdf4; }.orbit-stage :deep(.swatch-tile i:nth-child(3)) { background:#263449; }
.orbit-stage :deep(.line-tile i) { display:block; background:#d6e1ef; height:3px; width:90%; margin-bottom:6px; }.orbit-stage :deep(.line-tile i:nth-child(2)) { width:60%; }
.orbit-stage :deep(.control-tile) { display:flex; align-items:center; justify-content:space-between; }.orbit-stage :deep(.control-tile i) { width:26px; height:14px; border-radius:15px; background:#3c66e4; position:relative; }.orbit-stage :deep(.control-tile i::after) { content:''; position:absolute; width:10px; height:10px; background:white; border-radius:50%; right:2px; top:2px; }.orbit-stage :deep(.control-tile b) { font-size:17px; color:#3562e4; }
.orbit-stage :deep(.sample-button) { margin-top:12px; font-size:7px; color:#3a61bd; display:flex; justify-content:space-between; }
.orbit-stage :deep(.editorial-art) { height:137px; position:relative; overflow:hidden; background:linear-gradient(135deg,#c4dcf3,#f4f1e8); margin-top:16px; }.orbit-stage :deep(.arch) { position:absolute; bottom:-25px; left:35px; width:85px; height:125px; border:20px solid #faf5ec; border-radius:65px 65px 0 0; transform:rotate(15deg); box-shadow:13px 5px 15px #2c567d3b; }.orbit-stage :deep(.stone) { position:absolute; bottom:-8px; right:14px; width:60px; height:85px; background:linear-gradient(120deg,#a6c9eb,#5d86b2); transform:rotate(-10deg); }.orbit-stage :deep(.sun) { position:absolute; width:30px; height:30px; border-radius:50%; background:#fff9e8; right:24px; top:12px; }
.orbit-stage :deep(.project-meta) { display:flex; justify-content:space-between; margin-top:10px; font-size:6px; letter-spacing:.1em; }
.orbit-stage :deep(.glass-base) { position:absolute; bottom:-9px; left:4px; right:4px; height:22px; pointer-events:none; border-bottom:2px solid #b6daf4a6; background:linear-gradient(180deg,transparent 20%,#a6d1f133 65%,#e0f5ff80 90%,#659ac578); box-shadow:0 12px 16px -8px #2a4e6b70; }
.orbit-stage :deep(.glass-base i) { position:absolute; bottom:0; width:16px; height:22px; border:1px solid #dcf4ff; border-right:2px solid #3776c780; background:linear-gradient(120deg,#d7edff75,#417ac18c 70%,#b1e3ffb3); box-shadow:inset 3px 0 4px #fff9,5px 4px 6px #27579844; }
.orbit-stage :deep(.glass-base i:first-child) { left:12px; height:19px; }.orbit-stage :deep(.glass-base i:nth-child(2)) { right:11px; height:24px; width:18px; }.orbit-stage :deep(.glass-base i:nth-child(3)) { right:35px; height:16px; }
.orbit-controls { display:flex; justify-content:center; align-items:center; gap:18px; position:relative; z-index:3; }
.orbit-controls :deep(.orbit-arrow) { width:44px; height:44px; min-width:44px; min-height:44px; padding:0!important; border:1px solid #38536d30!important; border-radius:50%!important; background:transparent!important; color:#354e67!important; box-shadow:none!important; font-size:19px; transition:background .2s,border-color .2s,transform .2s; }
.orbit-controls :deep(.orbit-arrow:hover) { background:#ffffff38!important; border-color:#38536d66!important; transform:translateY(-1px); }
.orbit-controls :deep(.orbit-arrow:active) { transform:translateY(0); background:#ffffff55!important; }
.orbit-controls :deep(.orbit-arrow:focus-visible) { outline:2px solid #315fd1; outline-offset:4px; }
.orbit-pager { display:flex; gap:3px; }.orbit-pager button { border:0; background:transparent; width:30px; height:38px; display:grid; place-items:center; cursor:pointer; }.orbit-pager span { width:6px; height:6px; border-radius:50%; background:#9dacc0; }.orbit-pager [aria-current] span { width:20px; border-radius:8px; background:#315fd1; }
.orbit-caption { text-align:center; font-size:11px; color:#5c708a; margin:12px 0 0; }.orbit-caption strong { display:block; font-size:13px; color:#263c58; margin-bottom:4px; }.orbit-fallback { display:flex; justify-content:center; gap:18px; font-size:12px; }
@media(max-width:740px) { .orbit-gallery { position:relative; left:auto; right:auto; top:auto; bottom:auto; height:420px; margin-top:8px; }.orbit-stage { height:330px; }.orbit-caption { margin-top:6px; }.orbit-caption span { font-size:10px; } }
</style>
