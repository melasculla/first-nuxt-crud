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
   </div>
</template>

<script setup lang="ts">
const currentUser = useState<User>('currentUser')
</script>

<style scoped></style>