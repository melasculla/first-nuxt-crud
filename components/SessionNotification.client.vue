<template>
   <transition name="notification">
      <div v-if="useState('sessionNotification').value"
         class="fixed bottom-24 right-14 flex items-center px-4 py-3 gap-4 rounded-lg bg-red-500 text-lg text-white">
         Session Expired
         <svg class="size-8 animate-pulse text-white" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
            viewBox="0 0 24 24">
            <path fill="currentColor"
               d="M12 18q2.5 0 4.25-1.75T18 12t-1.75-4.25T12 6v6l-4.25 4.25q.875.825 1.963 1.288T12 18m0 4q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
         </svg>
      </div>
   </transition>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
   transition: all 500ms ease-in;
}

.notification-leave-to,
.notification-enter-from {
   transform: translateY(200px);
}
</style>