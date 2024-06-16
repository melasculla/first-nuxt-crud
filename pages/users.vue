<template>
   <div class="bg-emerald-400 py-14 text-center h-5/6">
      <p class="text-xl mb-6">All users</p>
      <template v-if="!pending">
         <div v-if="users?.length" class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 items-center">
            <NuxtLink :to="`/user/${user.id}`" v-for="user in users" :key="user.id"
               class="block max-w-max text-lg border-2 border-white px-6 py-1 hover:bg-white hover:text-black hover:border-black transition-colors mx-auto rounded-md leading-none">
               {{ user.name }}
            </NuxtLink>
         </div>
         <div v-else class="text-3xl uppercase tracking-wider">
            <p class="animate-bounce">Users don't exist</p>
         </div>
      </template>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 items-center" v-else>
         <div v-for="user in 6" :key="user"
            class="block max-w-full w-3/6 h-12 border-2 border-white px-6 py-1 mx-auto rounded-md bg-slate-500 animate-pulse">
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
const { data: users, pending, refresh } = await useFetch('/api/users', { immediate: false })

onMounted(() => refresh())
</script>

<style scoped></style>