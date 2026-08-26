<!-- pages/smoke/feedback.vue -->
<script setup lang="ts">
import {
  UiEmpty,
  UiLoading,
  UiToast,
  UiConfirm,
  UiButton,
  openToast,
  openConfirm,
} from '@leechanyong/ispark-ui'

// ===== 이벤트 핸들러 =====
// openToast / openConfirm은 명령형 API다.
// 반드시 이벤트 핸들러 안에서만 호출한다. setup 최상단에서 부르면
// 서버에서 DOM에 접근하려다 죽는다.
const onToastClick = () => {
  openToast({ type: 'success', message: '저장되었습니다' })
}

const onConfirmClick = async () => {
  const ok = await openConfirm({ title: '삭제', message: '정말 삭제할까요?' })
  console.log('confirm 결과:', ok)
}
</script>

<template>
  <main data-smoke="feedback" style="padding: 32px; display: grid; gap: 24px">
    <h1>Feedback 그룹</h1>

    <section data-c="UiEmpty">
      <h2>빈 상태</h2>
      <UiEmpty text="등록된 프로젝트가 없습니다" />
    </section>

    <section data-c="UiLoading">
      <h2>로딩</h2>
      <UiLoading />
    </section>

    <section data-c="UiToast">
      <h2>토스트</h2>
      <UiButton @click="onToastClick">토스트 띄우기</UiButton>
      <ClientOnly><UiToast /></ClientOnly>
    </section>

    <section data-c="UiConfirm">
      <h2>컨펌</h2>
      <UiButton @click="onConfirmClick">삭제 확인</UiButton>
      <ClientOnly><UiConfirm /></ClientOnly>
    </section>

    <!--
      UiProgress는 Storybook 문서에는 있으나 npm 0.5.16 패키지에 없다.
      ispark-ui 재배포 후 이 그룹에 추가한다.
    -->
  </main>
</template>
