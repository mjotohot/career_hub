<script setup lang="ts">
import {
  PhList,
  PhSunDim,
  PhMoonStars,
  PhHouse,
  PhBookOpenUser,
  PhSignpost,
  PhUserGear,
} from '@phosphor-icons/vue'
import { useThemeStore } from '@/stores/theme'
import csuLogo from '@/assets/images/logo.png'
import navImage from '@/assets/images/navbar.svg'

const themeStore = useThemeStore()

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
            <li>
              <a><PhHouse :size="16" weight="bold" />Home</a>
            </li>
            <li>
              <a><PhSignpost :size="16" weight="bold" />How to apply?</a>
            </li>
            <li>
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
          <li>
            <a href="#home"><PhHouse :size="16" weight="bold" />Home</a>
          </li>
          <li>
            <a href="#apply"><PhSignpost :size="16" weight="bold" />How to apply?</a>
          </li>
          <li>
            <a href="#about"><PhBookOpenUser :size="16" weight="bold" />About</a>
          </li>
        </ul>
      </div>
      <div class="navbar-end flex items-center gap-3">
        <div class="hidden lg:flex gap-2">
          <a class="btn btn-ghost text-white rounded-lg hover:text-black"
            ><PhUserGear :size="16" weight="bold" />HR Staff Login</a
          >
          <button class="btn bg-[#ff9900] rounded-lg text-white">Browse Jobs</button>
        </div>
        <div class="h-8 w-px bg-white/40"></div>
        <label class="swap swap-rotate">
          <input type="checkbox" @change="toggleTheme" :checked="themeStore.theme === 'dark'" />
          <PhSunDim class="swap-off text-white" :size="25" weight="bold" />
          <PhMoonStars class="swap-on" :size="25" weight="bold" />
        </label>
      </div>
    </div>
  </div>
</template>
