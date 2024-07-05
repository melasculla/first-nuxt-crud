<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SessionNotification />
  </div>
</template>

<style>
html {
  font-size: 20px;
}

.page-enter-active,
.page-leave-active {
  transition: all 400ms ease;
}

.page-enter-active {
  position: absolute;
  width: 100vw;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
}

.page-enter-from,
.page-leave-to {
  filter: blur(10px);
  opacity: 0;
}

/* .page-enter-active,
.page-leave-active {
  transition: all 800ms ease-in-out;
}

.page-enter-active {
  position: absolute;
  width: 100vw;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
}

.page-enter-from {
  transform: scale(0);
  transform-origin: top;
}

.page-leave-to {
  opacity: 0;
} */
</style>

<style lang="postcss">
.nuxtImage-loading {
  @apply aspect-video w-full block mx-auto !object-contain animate-spin
}
</style>