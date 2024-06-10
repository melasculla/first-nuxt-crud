<template>
   <div class="text-2xl text-center py-20 px-5 text-green-600">
      Index page
      <br>
      {{ test }}
   </div>
</template>

<script setup lang="ts">
const test = useState('currentUser')
</script>

<style scoped>

</style>