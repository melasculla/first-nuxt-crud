<template>
   <myHeader />
   <main class="relative">
      <slot />
   </main>
   <myFooter />
</template>

<script setup lang="ts">
useHead({
   bodyAttrs: {
      class: 'bg-slate-950'
   }
})
</script>

<style scoped></style>