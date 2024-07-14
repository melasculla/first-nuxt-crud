<template>
   <div class="text-2xl text-center py-20 px-5 text-green-600">
      Index page
      <br>
      <div class="grid grid-cols-2 mt-4" v-if="currentUser">
         <p>
            Name: {{ currentUser.name }}
         </p>
         <p>
            Role: {{ currentUser.role }}
         </p>
      </div>
      <NuxtImg src="https://images.unsplash.com/photo-1546083381-2bed38b42cac" placeholder="/loader.svg"
      placeholder-class="nuxtImage-loading" />
      <NuxtImg src="https://royalkingdomofmc.com/wp-content/themes/royal/img/about-bg.jpg" placeholder="/loader.svg"
      placeholder-class="nuxtImage-loading" loading="lazy" />
      <NuxtImg src="http://localhost:3000/api/test?image=2b6b011018e8b72d5db3cf625b992922.jpg" placeholder="/loader.svg"
         placeholder-class="nuxtImage-loading" />
   </div>
</template>

<script setup lang="ts">
const currentUser = useState<User>('currentUser')
</script>

<style scoped></style>