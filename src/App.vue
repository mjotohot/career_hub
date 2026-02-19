<script setup>
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
authStore.initialize()
</script>

<template>
  <router-view />
</template>

<style scoped></style>
