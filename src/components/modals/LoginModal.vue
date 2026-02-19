<script setup>
import { PhX, PhUser, PhLockSimple } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { ref } from 'vue'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const submit = async () => {
  const success = await authStore.signIn(email.value, password.value)
  if (success) {
    window.location.href = '/dashboard'
  } else {
    alert(authStore.error)
  }
}

const emit = defineEmits(['close'])
</script>

<template>
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-base-300 rounded-2xl shadow-2xl max-w-md w-full p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold">HR Staff Portal</h2>
        <button className="hover:text-foreground" @click="emit('close')">
          <PhX :size="16" />
        </button>
      </div>

      <p className="mb-6">Sign in to manage positions and applications</p>

      <form className="space-y-4" @submit.prevent="submit">
        <label className="input w-full">
          <PhUser :size="20" weight="bold" />
          <input v-model="email" type="text" className="grow" placeholder="ID Number" required />
        </label>
        <label className="input w-full">
          <PhLockSimple :size="20" weight="bold" />
          <input
            v-model="password"
            type="password"
            className="grow"
            placeholder="••••••••"
            required
          />
        </label>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 border border-border rounded cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>
          <a href="#" className="text-sm text-primary transition"> Forgot password? </a>
        </div>
        <button
          type="submit"
          :disabled="authStore.loading"
          className="btn bg-[#003300] text-white rounded-lg border-b-2 border-[#ff9900] w-full"
        >
          Access Dashboard
        </button>
      </form>

      <div
        className="mt-6 pt-6 italic border-t border-gray-300 text-center text-sm text-muted-foreground"
      >
        Contact your IT administrator for login credentials or password resets.
      </div>
    </div>
  </div>
</template>
