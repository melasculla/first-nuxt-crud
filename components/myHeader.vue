<template>
   <div>
      <header class="bg-cyan-700 py-4">
         <div class="container mx-auto">
            <nav
               class="flex gap-6 sm:gap-2 flex-wrap sm:flex-nowrap justify-evenly max-w-screen-lg mx-auto py-6 px-5 sm:px-0 sm:py-0">
               <NuxtLink
                  class="max-w-max py-2 px-2 text-white font-bold text-base transition-colors duration-600 hover:text-amber-500 hover:bg-slate-800 rounded-lg bg-rose-300 sm:bg-transparent"
                  to="/">Home</NuxtLink>
               <NuxtLink
                  class="max-w-max py-2 px-2 text-white font-bold text-base transition-colors duration-600 hover:text-amber-500 hover:bg-slate-800 rounded-lg bg-rose-300 sm:bg-transparent"
                  to="/users">Users</NuxtLink>
               <NuxtLink
                  class="max-w-max py-2 px-2 text-white font-bold text-base transition-colors duration-600 hover:text-amber-500 hover:bg-slate-800 rounded-lg bg-rose-300 sm:bg-transparent"
                  to="/posts">Posts</NuxtLink>
               <NuxtLink
                  class="max-w-max py-2 px-2 text-white font-bold text-base transition-colors duration-600 hover:text-amber-500 hover:bg-slate-800 rounded-lg bg-rose-300 sm:bg-transparent"
                  to="/posts/create">Create Post</NuxtLink>
               <NuxtLink
                  class="max-w-max py-2 px-2 text-white font-bold text-base transition-colors duration-600 hover:text-amber-500 hover:bg-slate-800 rounded-lg bg-rose-300 sm:bg-transparent"
                  to="/login" v-if="!loggedIn">Log In</NuxtLink>
               <button
                  class="max-w-max py-2 px-2 text-white font-bold text-base transition-colors duration-600 hover:text-amber-500 hover:bg-slate-800 rounded-lg bg-rose-300 sm:bg-transparent"
                  @click="logout" v-if="loggedIn">Log Out</button>
            </nav>
         </div>
      </header>
      <div class="fixed bottom-20 right-10 text-orange-500 text-2xl z-10 filter drop-shadow-2xl font-black" v-if="loggedIn">
         Welcome, {{ user?.name }}
      </div>
   </div>
</template>

<script setup lang="ts">
const { user, loggedIn, logout: logOut } = useAuth()
const logout = async () => await logOut()
</script>

<style scoped></style>