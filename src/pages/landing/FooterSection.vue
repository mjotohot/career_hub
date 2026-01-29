<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer
    className="footer sm:footer-horizontal footer-center bg-[#003300] border-t-5 border-[#ff9900] text-base-content p-4"
  >
    <aside class="text-white">
      <p>Copyright © {{ year }} - All right reserved by Caraga State University</p>
    </aside>
  </footer>
</template>
