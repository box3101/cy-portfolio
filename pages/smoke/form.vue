<!-- pages/smoke/form.vue -->
<script setup lang="ts">
import {
  UiButton,
  UiInput,
  UiTextarea,
  UiToggle,
  UiCheckbox,
  UiRadio,
} from '@leechanyong/ispark-ui'

// ===== 상태 =====
const email = ref('')
const bio = ref('')
const isPublic = ref(true)
const agreed = ref(false)
const contactWay = ref('email')
</script>

<template>
  <main data-smoke="form" style="padding: 32px; display: grid; gap: 24px">
    <h1>Form 그룹</h1>

    <section data-c="UiButton">
      <UiButton variant="primary" size="md">저장하기</UiButton>
      <UiButton variant="secondary" size="md">취소</UiButton>
      <UiButton variant="ghost" size="sm">더보기</UiButton>
      <UiButton variant="danger" size="lg">삭제</UiButton>
    </section>

    <section data-c="UiInput">
      <label for="smoke-email">이메일 주소</label>
      <UiInput id="smoke-email" v-model="email" placeholder="you@example.com" />
    </section>

    <section data-c="UiTextarea">
      <label for="smoke-bio">자기소개</label>
      <UiTextarea id="smoke-bio" v-model="bio" placeholder="소개를 입력하세요" />
    </section>

    <section data-c="UiToggle">
      <label for="smoke-public">공개 여부</label>
      <UiToggle id="smoke-public" v-model="isPublic" />
    </section>

    <section data-c="UiCheckbox">
      <UiCheckbox v-model="agreed">약관 동의</UiCheckbox>
    </section>

    <section data-c="UiRadio">
      <fieldset>
        <legend>연락 방법</legend>
        <UiRadio v-model="contactWay" value="email">이메일</UiRadio>
        <UiRadio v-model="contactWay" value="phone">전화</UiRadio>
      </fieldset>
    </section>
  </main>
</template>
