export default defineNuxtRouteMiddleware((to) => {
  const componentStore = useComponentStore();
  if (componentStore.isEmpty) {
    return navigateTo('/build')
  }
})
