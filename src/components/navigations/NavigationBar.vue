<script setup lang="ts">
import { useThemeStore } from '@/stores/usethemeStore'
import { useRoute } from 'vue-router'
import csuLogo from '@/assets/images/logo.png'
import navImage from '@/assets/images/navbar.svg'
import LoginModal from '../modals/LoginModal.vue'
import { ref } from 'vue'
import {
  PhList,
  PhSun,
  PhMoonStars,
  PhHouse,
  PhBookOpenUser,
  PhSignpost,
  PhUserGear,
} from '@phosphor-icons/vue'

const isModalOpen = ref(false)
const themeStore = useThemeStore()
const route = useRoute()

function toggleTheme() {
  themeStore.setTheme(themeStore.theme === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <div
    class="navbar sticky top-0 bg-[#003300] shadow-lg lg:px-6 border-b-5 border-[#ff9900] z-50"
    :style="{
      backgroundImage: `url(${navImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="absolute inset-0 bg-[#003300]/95 pointer-events-none z-0"></div>
    <div class="relative z-10 flex w-full items-center">
      <div class="navbar-start">
        <div class="dropdown">
          <div :tabIndex="0" role="button" class="btn btn-ghost text-white lg:hidden">
            <PhList :size="32" weight="light" />
          </div>
          <ul
            tabIndex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li v-if="route.path !== '/jobs'">
              <a><PhHouse :size="16" weight="bold" />Home</a>
            </li>
            <li v-if="route.path !== '/jobs'">
              <a><PhSignpost :size="16" weight="bold" />How to apply?</a>
            </li>
            <li v-if="route.path !== '/jobs'">
              <a><PhBookOpenUser :size="16" weight="bold" />About</a>
            </li>
          </ul>
        </div>
        <div class="flex items-center">
          <div class="bg-white px-4 h-full flex items-center rounded-sm">
            <img :src="csuLogo" class="h-12 w-auto" />
          </div>
        </div>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 text-white">
          <li v-if="route.path !== '/jobs'">
            <a href="#home"><PhHouse :size="16" weight="bold" />Home</a>
          </li>
          <li v-if="route.path !== '/jobs'">
            <a href="#apply"><PhSignpost :size="16" weight="bold" />How to apply?</a>
          </li>
          <li v-if="route.path !== '/jobs'">
            <a href="#about"><PhBookOpenUser :size="16" weight="bold" />About</a>
          </li>
        </ul>
      </div>
      <div class="navbar-end flex items-center gap-3">
        <div class="hidden lg:flex gap-2">
          <a
            class="btn btn-ghost text-white rounded-lg shadow-none border-none hover:text-black"
            @click="isModalOpen = true"
            ><PhUserGear :size="16" weight="bold" />HR Staff Login</a
          >
          <router-link v-if="route.path !== '/jobs'" to="/jobs">
            <button class="btn bg-[#ff9900] rounded-lg border-none shadow-none text-white">
              Browse Jobs
            </button>
          </router-link>
        </div>
        <div class="h-8 w-px bg-white/40"></div>
        <label class="swap swap-rotate">
          <input type="checkbox" @change="toggleTheme" :checked="themeStore.theme === 'dark'" />
          <PhSun class="swap-off text-white" :size="25" weight="bold" />
          <PhMoonStars class="swap-on" :size="25" weight="bold" />
        </label>
      </div>
    </div>
  </div>

  <LoginModal v-if="isModalOpen" @close="isModalOpen = false" />
</template>
