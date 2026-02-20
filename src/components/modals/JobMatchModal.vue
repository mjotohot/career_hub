<script setup lang="ts">
import { computed } from 'vue'
import { PhCheckCircle, PhWarningCircle, PhX } from '@phosphor-icons/vue'

const props = defineProps<{
  isOpen: boolean
  status: 'loading' | 'pass' | 'fail' | null
  jobTitle?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const isCloseable = computed(() => props.status === 'pass' || props.status === 'fail')

const config = computed(() => {
  switch (props.status) {
    case 'loading':
      return {
        icon: null,
        iconClass: '',
        badgeClass: 'badge-info',
        badgeLabel: 'Analyzing...',
        title: 'Evaluating Your Match',
        message:
          'AI is reviewing your qualifications against the job requirements. This will only take a moment.',
        // accentClass: 'border-info/30 bg-info/5',
      }
    case 'pass':
      return {
        icon: PhCheckCircle,
        iconClass: 'text-success',
        badgeClass: 'badge-success',
        badgeLabel: 'Strong Match',
        title: 'Great News!',
        message:
          'Your qualifications align well with this position. The hiring team will review your application shortly.',
        // accentClass: 'border-success/30 bg-success/5',
      }
    case 'fail':
      return {
        icon: PhWarningCircle,
        iconClass: 'text-warning',
        badgeClass: 'badge-warning',
        badgeLabel: 'Partial Match',
        title: 'Application Submitted',
        message:
          'Your qualifications may not fully match all requirements, but we still encourage you. The hiring team will review every application carefully.',
        // accentClass: 'border-warning/30 bg-warning/5',
      }
    default:
      return null
  }
})

// :class="config?.accentClass ?? 'border-base-200'"
</script>

<template>
  <dialog class="modal modal-bottom sm:modal-middle z-9999" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-sm border transition-colors duration-500 border-base-200">
      <button
        v-if="isCloseable"
        class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
        @click="emit('close')"
      >
        <PhX :size="16" />
      </button>

      <div class="flex flex-col items-center text-center gap-3 py-4">
        <div class="relative flex items-center justify-center w-16 h-16">
          <span v-if="status === 'loading'" class="loading loading-ring loading-lg text-info" />
          <component
            v-else-if="config?.icon"
            :is="config.icon"
            :size="56"
            weight="duotone"
            :class="config.iconClass"
          />
        </div>

        <span class="badge badge-sm font-semibold tracking-wide" :class="config?.badgeClass">
          {{ config?.badgeLabel }}
        </span>

        <h3 class="font-bold text-lg leading-tight">{{ config?.title }}</h3>

        <p class="text-sm text-base-content/80 leading-relaxed px-2">
          {{ config?.message }}
        </p>

        <p v-if="jobTitle" class="text-xs text-base-content font-semibold mt-1">
          Applied Role: {{ jobTitle }}
        </p>
      </div>

      <div class="modal-action mt-2" v-if="isCloseable">
        <button class="btn btn-primary btn-sm w-full" @click="emit('close')">Done</button>
      </div>
    </div>

    <div class="modal-backdrop bg-black/30" @click="isCloseable ? emit('close') : undefined" />
  </dialog>
</template>
