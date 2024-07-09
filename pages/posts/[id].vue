<template>
   <div class="bg-emerald-400 py-3 sm:pt-7 sm:pb-14 text-black">
      <div class="grid sm:grid-cols-2 justify-center sm:justify-between justify-items-center sm:justify-items-start items-center gap-4 mb-4 sm:mb-2 sm:gap-2 px-4">
         <NuxtLink to="/posts"
            class="text-base hover:text-white hover:bg-orange-400 px-4 py-1 border-2 border-orange-400 rounded-lg transition-colors">
            Back
            to
            Posts</NuxtLink>
         <NuxtLink :to="`/posts/edit-${id}`" v-if="loggedIn"
            class="text-base hover:text-white hover:bg-orange-400 px-4 py-1 border-2 border-orange-400 rounded-lg transition-colors sm:justify-self-end">
            Edit</NuxtLink>
      </div>
      <article v-if="!pending" class="overflow-hidden">
         <div class="mb-2">
            <h2 class="text-xl first-letter:capitalize text-center">{{ post?.title }}</h2>
            <ClientOnly>
               <small class="block text-gray-700 italic font-bold text-center">{{ date }}</small>
            </ClientOnly>
         </div>
         <NuxtImg v-if="post?.thumbnail" :src="post?.thumbnail" class="block w-2/3 lg:w-1/2 max-w-[800px] mx-auto my-2"
            loading="lazy" placeholder="/loader.svg" placeholder-class="nuxtImage-loading" :alt="post?.title" />
         <EditorContent :content="post?.content" v-if="post?.content?.blocks.length" />
         <Gallery class="mt-6" :data="post?.gallery" v-if="post?.gallery?.length" />
         <button type="button" class="font-bold flex justify-center items-center gap-1 mt-4 mx-auto"
            @click="toggleLike">
            <template v-if="!proccesingLike">
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
            </template>
            <template v-else>
               <span class="text-sm">{{ post?.likes }}</span>
               <img class="size-5 animate-spin" src="/loader.svg">
            </template>
         </button>
      </article>
      <div v-else class="text-center font-bold text-3xl">
         <p>Loading...</p>
      </div>
   </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { id } = useRoute().params
const { data: post, pending, error } = await useLazyFetch<Post>('/api/posts/' + id)

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