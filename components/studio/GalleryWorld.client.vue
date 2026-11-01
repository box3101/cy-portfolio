<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const props = defineProps<{ active: string }>()
const emit = defineEmits<{ ready: [value: boolean] }>()
const host = ref<HTMLDivElement>()
const router = useRouter()
let cleanup = () => {}
onMounted(() => {
  const el = host.value
  if (!el) return
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let renderer: THREE.WebGLRenderer | undefined
  let disposed = false
  let frame = 0
  let visible = !document.hidden
  let hovered = ''
  let down: { x: number; y: number } | null = null
  const scene = new THREE.Scene()
  const textures: THREE.Texture[] = []
  let controls: OrbitControls | undefined
  let observer: ResizeObserver | undefined
  const disposers: (() => void)[] = []
  function listen(target: EventTarget, name: string, fn: EventListener) {
    target.addEventListener(name, fn); disposers.push(() => target.removeEventListener(name, fn))
  }
  cleanup = () => {
    disposed = true; cancelAnimationFrame(frame); observer?.disconnect(); controls?.dispose()
    disposers.forEach(fn => fn())
    scene.traverse(obj => { if (obj instanceof THREE.Mesh) { obj.geometry.dispose(); (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose()) } })
    textures.forEach(t => t.dispose()); renderer?.dispose(); renderer?.domElement.remove()
  }
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2
    el.prepend(renderer.domElement)
    const canvas = renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100)
    controls = new OrbitControls(camera, canvas)
    controls.enablePan = false; controls.enableZoom = false; controls.enableDamping = true; controls.dampingFactor = .075
    controls.minPolarAngle = .85; controls.maxPolarAngle = 1.35
    controls.minAzimuthAngle = -.32; controls.maxAzimuthAngle = .5
    scene.add(new THREE.HemisphereLight(0xe5f0ff, 0xb9a98d, 2.5))
    const sun = new THREE.DirectionalLight(0xfff2df, 4.2); sun.position.set(-7, 13, 9); sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); sun.shadow.bias = -.001
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0xaecfff, 1.5); fill.position.set(8, 6, -5); scene.add(fill)
    const stone = new THREE.MeshStandardMaterial({ color: 0xeee6d8, roughness: .78 })
    const silver = new THREE.MeshStandardMaterial({ color: 0xdce5ea, metalness: .75, roughness: .28 })
    const blue = new THREE.MeshPhysicalMaterial({ color: 0x8bb7ff, metalness: .08, roughness: .16, transparent: true, opacity: .26, side: THREE.DoubleSide, depthWrite: false })
    const edge = new THREE.MeshStandardMaterial({ color: 0x6899e6, metalness: .6, roughness: .23 })
    function box(parent: THREE.Object3D, w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m
    }
    function cylinder(parent: THREE.Object3D, radius: number, height: number, x: number, y: number, z: number, material = stone) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 64), material); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m
    }
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.ShadowMaterial({ opacity: .16 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -.03; ground.receiveShadow = true; scene.add(ground)
    cylinder(scene, 7.8, .18, 0, .06, 0)
    const exhibits = [
      { id: 'design', x: -4.4, z: .4, w: 2.5, h: 3, radius: 1.85, image: '/images/pt-ispark-ui.svg', href: 'https://box3101.github.io/ispark-ui/' },
      { id: 'proposal', x: 0, z: -.3, w: 4.2, h: 4.5, radius: 2.85, image: '/images/work/proposal-ui-concept.png', href: '/work/proposal-agent' },
      { id: 'si', x: 4.4, z: .1, w: 2.5, h: 3.2, radius: 1.85, image: '/images/pt-incheon-city.png', href: '/projects?space=si' },
    ]
    const loader = new THREE.TextureLoader()
    const animated: { id: string; group: THREE.Group; base: number; slices: THREE.Mesh[] }[] = []
    const hitTargets: THREE.Object3D[] = []
    for (const item of exhibits) {
      cylinder(scene, item.radius, .65, item.x, .5, item.z)
      cylinder(scene, item.radius + .035, .045, item.x, .85, item.z, silver)
      const group = new THREE.Group(); group.position.set(item.x, .9, item.z); group.userData.id = item.id; scene.add(group)
      const slices: THREE.Mesh[] = []
      for (let i = 0; i < 3; i++) {
        const panel = box(group, item.w, item.h, .055, blue, i * .12, item.h / 2 + .12, -.2 - i * .28)
        slices.push(panel)
        box(group, .025, item.h, .065, edge, item.w / 2 + i * .12, item.h / 2 + .12, -.2 - i * .28)
      }
      const texture = loader.load(item.image, t => { if (disposed) t.dispose() }); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture)
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(item.w * .89, item.w * .89 * .625), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }))
      screen.position.set(0, item.h * .53, .05); group.add(screen)
      const backing = box(group, item.w * .92, item.w * .92 * .625, .04, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .35 }), 0, item.h * .53, .015)
      hitTargets.push(...slices, screen, backing)
      box(group, .22, .48, .65, silver, -item.w * .3, .12, 0); box(group, .22, .48, .65, silver, item.w * .3, .12, 0)
      animated.push({ id: item.id, group, base: -.12, slices })
    }
    // A sculptural arch frames the exhibition without obscuring the interface panels.
    const arch = new THREE.Mesh(new THREE.TorusGeometry(9, .34, 12, 100, Math.PI), stone)
    arch.position.set(0, .2, -4); scene.add(arch)
    const orb = new THREE.Mesh(new THREE.SphereGeometry(.55, 32, 24), silver); orb.position.set(5.5, 1.4, 1.4); scene.add(orb)
    const ray = new THREE.Raycaster(); const pointer = new THREE.Vector2()
    function pick(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect(); pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1)
      ray.setFromCamera(pointer, camera)
      const hit = ray.intersectObjects(hitTargets, false)[0]
      return hit?.object.parent?.userData.id as string | undefined
    }
    listen(canvas, 'pointermove', ((event: PointerEvent) => { hovered = pick(event) ?? ''; canvas.style.cursor = down ? 'grabbing' : hovered ? 'pointer' : 'grab' }) as EventListener)
    listen(canvas, 'pointerleave', (() => { hovered = ''; down = null }) as EventListener)
    listen(canvas, 'pointercancel', (() => { down = null }) as EventListener)
    listen(canvas, 'pointerdown', ((event: PointerEvent) => { down = { x: event.clientX, y: event.clientY } }) as EventListener)
    listen(canvas, 'pointerup', ((event: PointerEvent) => {
      if (!down) return
      const distance = Math.hypot(event.clientX - down.x, event.clientY - down.y); down = null
      if (distance > 6 || event.button !== 0) return
      const item = exhibits.find(item => item.id === pick(event)); if (!item) return
      if (item.id === 'design') window.open(item.href, '_blank', 'noopener,noreferrer')
      else void router.push(item.href)
    }) as EventListener)
    listen(canvas, 'webglcontextlost', (() => { cancelAnimationFrame(frame); emit('ready', false) }) as EventListener)
    const resize = () => {
      if (!renderer) return
      const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix()
      const narrow = w < 650
      camera.position.set(3, narrow ? 10 : 8, narrow ? 25 : 20)
      controls!.target.set(0, 2, 0); controls!.update()
    }
    observer = new ResizeObserver(resize); observer.observe(el); resize()
    const clock = new THREE.Clock()
    const render = () => {
      if (disposed || !visible || !renderer) return
      const dt = Math.min(clock.getDelta(), .05); const blend = 1 - Math.exp(-dt * 8)
      const active = props.active || hovered
      for (const exhibit of animated) {
        const selected = active === exhibit.id && !motion.matches
        exhibit.group.rotation.y = THREE.MathUtils.lerp(exhibit.group.rotation.y, exhibit.base + (selected ? -.22 : .04), blend)
        exhibit.group.position.y = THREE.MathUtils.lerp(exhibit.group.position.y, selected ? 1.12 : .9, blend)
        exhibit.slices.forEach((slice, i) => {
          slice.rotation.y = THREE.MathUtils.lerp(slice.rotation.y, selected ? (i - 1) * .1 : 0, blend)
          slice.position.z = THREE.MathUtils.lerp(slice.position.z, -.2 - i * (selected ? .46 : .28), blend)
        })
      }
      controls!.update(); renderer.render(scene, camera); frame = requestAnimationFrame(render)
    }
    listen(document, 'visibilitychange', (() => { visible = !document.hidden; cancelAnimationFrame(frame); if (visible) { clock.getDelta(); render() } }) as EventListener)
    render(); emit('ready', true)
  } catch (error) {
    console.warn('Gallery 3D initialization failed', error)
    cleanup(); emit('ready', false)
  }
})
onBeforeUnmount(() => cleanup())
</script>
<template><div ref="host" class="gallery-world" aria-label="드래그로 시점을 바꿀 수 있는 3D 전시대" /></template>
<style scoped>
.gallery-world { position:absolute; z-index:0; left:32%; right:-3%; top:10%; bottom:4%; background:radial-gradient(ellipse at 70% 10%,#dceaf844,transparent 65%); }
.gallery-world :deep(canvas) { display:block; width:100%; height:100%; cursor:grab; }
@media(max-width:740px) { .gallery-world { left:-12%; right:-12%; top:330px; height:330px; bottom:auto; } }
</style>
