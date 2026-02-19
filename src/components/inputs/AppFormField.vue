<script setup lang="ts">
import { computed } from 'vue'

type FieldType = 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'file'

interface SelectOption {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | File | null
    label: string
    type?: FieldType
    placeholder?: string
    hint?: string
    required?: boolean
    optional?: boolean
    disabled?: boolean
    accept?: string // for file inputs
    options?: SelectOption[] // for select inputs
    rows?: number // for textarea
    error?: string
  }>(),
  {
    type: 'text',
    required: false,
    optional: false,
    disabled: false,
    rows: 4,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | File | null]
  change: [event: Event]
}>()

const inputClasses = computed(() =>
  [
    props.type === 'select'
      ? 'select select-bordered w-full'
      : props.type === 'textarea'
        ? 'textarea textarea-bordered w-full resize-none text-sm leading-relaxed'
        : props.type === 'file'
          ? 'file-input file-input-bordered w-full'
          : 'input input-bordered w-full',
    props.error ? 'input-error' : '',
  ]
    .filter(Boolean)
    .join(' '),
)

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  emit('update:modelValue', file)
  emit('change', e)
}
</script>

<template>
  <div class="form-control">
    <label class="label">
      <span class="label-text font-bold text-xs">
        {{ label }}
        <span v-if="required" class="text-error">*</span>
      </span>
      <span v-if="optional" class="label-text-alt text-base-content/60 italic text-xs">
        (Optional)
      </span>
    </label>

    <!-- Select -->
    <select
      v-if="type === 'select'"
      :value="modelValue as string"
      :class="inputClasses"
      :disabled="disabled"
      :required="required"
      @change="onInput"
    >
      <option disabled value="">{{ placeholder ?? `Select ${label.toLowerCase()}` }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :value="modelValue as string"
      :class="inputClasses"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      @input="onInput"
    ></textarea>

    <!-- File -->
    <input
      v-else-if="type === 'file'"
      type="file"
      :class="inputClasses"
      :accept="accept"
      :disabled="disabled"
      :required="required"
      @change="onFileChange"
    />

    <!-- Text / Email / Tel / Date -->
    <input
      v-else
      :type="type"
      :value="modelValue as string"
      :class="inputClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      @input="onInput"
    />

    <!-- Hint / Error -->
    <label v-if="error || hint" class="label pt-1">
      <span v-if="error" class="label-text-alt text-error text-xs">{{ error }}</span>
      <span v-else-if="hint" class="label-text-alt text-base-content/60 italic text-xs">{{
        hint
      }}</span>
    </label>

    <!-- File confirmation slot -->
    <slot name="file-confirmation"></slot>
  </div>
</template>
