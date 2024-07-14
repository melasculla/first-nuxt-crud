<template>
   <div class="bg-emerald-400 p-5 h-5/6 flex items-center justify-center">
      <PostEditor :post-data="post" :edit="true" v-if="!pending" />
      <div v-else class="text-center font-bold text-3xl">
         <p>Loading...</p>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ['auth-require']
})

const params = useRoute().params
const { data: post, error, pending } = await useLazyFetch(`/api/posts/${params.id}`, {
   transform: (post: Post) => {
      const { isLiked, likes, createdAt, ...editablePost } = post
      return editablePost
   },
   server: false
})
</script>