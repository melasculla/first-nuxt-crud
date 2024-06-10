<template>
   <div class="bg-emerald-400 py-14 text-center text-black">
      <h2 class="text-xl first-letter:capitalize">{{ post?.title }}</h2>
      <small class="text-gray-700 italic font-bold">{{ date }}</small>
      <div class="grid grid-cols-1 md:grid-cols-5 mt-4">
         <div class="col-span-2 only:col-span-5" v-if="post?.thumbnail">
            <img :src="post?.thumbnail">
         </div>
         <div class="col-span-3 only:col-span-5" v-if="post?.content">
            <div v-html="post?.content"></div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params
const { data: post, error } = await useFetch<Post>('/api/posts/' + id)

if (error.value)
   throw createError({ statusCode: error.value.statusCode, statusMessage: error.value.statusMessage })

const isoString = post.value?.createdAt!
const isoDate = {
   year: new Date(isoString).getFullYear(),
   month: new Date(isoString).getMonth(),
   day: new Date(isoString).getDay(),
   hours: new Date(isoString).getHours(),
   minutes: new Date(isoString).getMinutes(),
}

const date = `${isoDate.day} ${isoDate.month}, ${isoDate.year} (${isoDate.hours + ':' + isoDate.minutes})`
</script>

<style scoped></style>