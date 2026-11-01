<template>
  <div class="studio-shell">
    <a class="studio-skip" href="#studio-main">본문으로 건너뛰기</a>
    <slot />
  </div>
</template>
<style>
.studio-shell { min-height: 100dvh; background: #081524; color: #edf4fc; }
.studio-skip { position: fixed; top: -80px; left: 20px; z-index: 100; background: white; color: #081524; padding: 12px 20px; }
.studio-skip:focus { top: 12px; }
.studio-shell a:focus-visible, .studio-shell button:focus-visible { outline: 3px solid #85d8f5; outline-offset: 5px; }
</style>
