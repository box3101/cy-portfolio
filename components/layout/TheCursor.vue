<script setup lang="ts">
/**
 * 커스텀 커서. 원본 사이트의 인터랙션을 이식했다.
 *
 * - 1200px 이하와 터치 기기에서는 숨긴다(CSS)
 * - prefers-reduced-motion 이면 아예 렌더하지 않는다
 * - .hover-target 요소 위에서 링이 확대된다
 */
const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
const enabled = ref(false)

let onMove: ((e: MouseEvent) => void) | null = null
let onOver: ((e: MouseEvent) => void) | null = null
let onOut: ((e: MouseEvent) => void) | null = null

onMounted(() => {
  // 터치 기기와 모션 감소 설정에서는 켜지 않는다.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (matchMedia('(hover: none)').matches) return
  enabled.value = true

  onMove = (e: MouseEvent) => {
    const x = `${e.clientX}px`
    const y = `${e.clientY}px`
    if (dot.value) {
      dot.value.style.left = x
      dot.value.style.top = y
    }
    if (ring.value) {
      ring.value.style.left = x
      ring.value.style.top = y
    }
  }

  // 이벤트 위임 — 페이지가 바뀌어도 다시 바인딩할 필요가 없다.
  onOver = (e: MouseEvent) => {
    if ((e.target as Element)?.closest?.('a, button, .hover-target')) {
      ring.value?.classList.add('is-hover')
    }
  }
  onOut = (e: MouseEvent) => {
    if ((e.target as Element)?.closest?.('a, button, .hover-target')) {
      ring.value?.classList.remove('is-hover')
    }
  }

  document.addEventListener('mousemove', onMove, { passive: true })
  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout', onOut)
})

onBeforeUnmount(() => {
  if (onMove) document.removeEventListener('mousemove', onMove)
  if (onOver) document.removeEventListener('mouseover', onOver)
  if (onOut) document.removeEventListener('mouseout', onOut)
})
</script>

<template>
  <ClientOnly>
    <template v-if="enabled">
      <span ref="dot" class="cursor-dot" aria-hidden="true"></span>
      <span ref="ring" class="cursor-ring" aria-hidden="true"></span>
    </template>
  </ClientOnly>
</template>

<style scoped>
.cursor-dot,
.cursor-ring {
  position: fixed;
  left: -100px;
  top: 50%;
  border-radius: 50%;
  transform: translateX(-50%) translateY(-50%);
  pointer-events: none;
  mix-blend-mode: difference;
}

.cursor-dot {
  width: 6px;
  height: 6px;
  background-color: #fff;
  z-index: 99999;
  transition: left 60ms linear, top 60ms linear;
}

.cursor-ring {
  width: 36px;
  height: 36px;
  border: 2px solid #fff;
  z-index: 99998;
  transition: left 300ms ease-out, top 300ms ease-out, transform 0.3s ease-out,
    background-color 0.3s ease-out;
}

.cursor-ring.is-hover {
  transform: translateX(-50%) translateY(-50%) scale(1.8);
  background: rgba(255, 255, 255, 1);
  border-color: transparent;
}

/* 좁은 화면·터치 기기에서는 숨긴다 */
@media (max-width: 1200px), (hover: none) {
  .cursor-dot,
  .cursor-ring {
    display: none;
  }
}
</style>
