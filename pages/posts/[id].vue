<template>
   <div class="bg-emerald-400 pt-7 pb-14 text-center text-black">
      <NuxtLink to="/posts"
         class="block max-w-fit mr-auto text-base hover:text-white hover:bg-orange-400 ml-6 px-4 py-1 border-2 border-orange-400 rounded-lg transition-colors">
         Back
         to
         Posts</NuxtLink>
      <h2 class="text-xl first-letter:capitalize">{{ post?.title }}</h2>
      <small class="text-gray-700 italic font-bold">{{ date }}</small>
      <div class="grid grid-cols-1 md:grid-cols-5 mt-4">
         <div class="col-span-2 only:col-span-5" v-if="post?.thumbnail">
            <img :src="post?.thumbnail">
         </div>
         <div class="col-span-3 only:col-span-5" v-if="post?.content">
            <div class="text-base" v-html="post?.content"></div>
         </div>
      </div>
      <button type="button" class="font-bold flex justify-center items-center gap-1 mt-2 mx-auto" @click="toggleLike">
         <span class="text-sm">{{ post?.likes }}</span>
         <svg v-if="post?.isLiked" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"
            class="hover:text-red-600 transition-colors size-5">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
               d="M44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326c1.194-.397 2.562-1.016 4.01-1.826M34.959 27l6.878 8.5m.001-8.5l-6.879 8.5" />
         </svg>
         <svg v-else class="text-red-600 size-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
            viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
               d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8" />
         </svg>
      </button>
   </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params
const { data: post, error } = await useLazyFetch<Post>('/api/posts/' + id)

if (error.value)
   throw createError({ statusCode: error.value.statusCode, statusMessage: error.value.statusMessage })

const date = computed(() => {
   const iso = post.value?.createdAt!
   const isoDate = {
      year: new Date(iso).getFullYear(),
      month: new Date(iso).getMonth(),
      day: new Date(iso).getDay(),
      hours: new Date(iso).getHours(),
      minutes: new Date(iso).getMinutes()
   }
   return `${isoDate.day} ${isoDate.month}, ${isoDate.year} (${isoDate.hours + ':' + isoDate.minutes})`
})

const router = useRouter()
const { loggedIn } = useAuth()
const proccesingLike = ref<boolean>(false)

const toggleLike = async () => {
   if (!loggedIn.value) return router.push('/login')
   if (!post.value || proccesingLike.value) return

   proccesingLike.value = true
   if (post.value.isLiked) {
      await $fetch('/api/posts/like/' + id, { method: 'DELETE' })
      post.value.likes! -= 1
   } else {
      await $fetch('/api/posts/like/' + id, { method: 'POST' })
      post.value.likes! += 1
   }
   proccesingLike.value = false

   post.value.isLiked = !post.value.isLiked
}
</script>

<style scoped></style>