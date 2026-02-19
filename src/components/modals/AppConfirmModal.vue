<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'error' | 'warning' | 'info'
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <dialog class="modal modal-bottom sm:modal-middle z-9999" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-sm">
      <h3 class="font-bold text-base mb-2">{{ title ?? 'Are you sure?' }}</h3>
      <p class="text-sm text-base-content/70">{{ message }}</p>
      <div class="modal-action mt-6">
        <button class="btn btn-ghost btn-sm" @click="emit('cancel')">
          {{ cancelLabel ?? 'Cancel' }}
        </button>
        <button
          class="btn btn-sm text-white"
          :class="{
            'btn-error': variant === 'error' || !variant,
            'btn-warning': variant === 'warning',
            'btn-info': variant === 'info',
          }"
          @click="emit('confirm')"
        >
          {{ confirmLabel ?? 'Confirm' }}
        </button>
      </div>
    </div>
    <div class="modal-backdrop bg-black/30" @click="emit('cancel')" />
  </dialog>
</template>
