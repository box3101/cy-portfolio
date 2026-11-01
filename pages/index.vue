<script setup lang="ts">
definePageMeta({ layout: 'studio' })
useSeoMeta({
  title: '이찬용 — 작은 불편에서 시작해, 더 나은 경험을 만듭니다.',
  description: '반복되는 일 속에서 문제를 발견하고, 기획과 디자인, 코드로 해결합니다. 프론트엔드 개발자 이찬용의 포트폴리오.',
  robots: 'index,follow',
})
useHead({ link: [{ rel: 'canonical', href: 'https://cy-portfolio-eight.vercel.app/' }] })
</script>

<template><StudioLanding /></template>
