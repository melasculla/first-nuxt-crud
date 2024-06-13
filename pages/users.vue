<template>
   <div class="bg-emerald-400 py-14 text-center h-5/6">
      <p class="text-xl mb-6">All users</p>
      <div v-if="users?.length" class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 items-center">
         <NuxtLink :to="`/user/${user.id}`" v-for="user in users" :key="user.id"
            class="block max-w-max text-lg border-2 border-white px-6 py-1 hover:bg-white hover:text-black hover:border-black transition-colors mx-auto rounded-md leading-none">
            {{ user.name }}
         </NuxtLink>
      </div>
      <div v-else class="text-3xl uppercase tracking-wider">
         <p class="animate-bounce">Users don't exist</p>
      </div>
   </div>
</template>

<script setup lang="ts">
const { data: users } = await useFetch('/api/users')
</script>

<style scoped></style>