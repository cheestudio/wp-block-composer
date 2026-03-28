import { wpComponentRegistry, getCategories, findRegistryEntry } from '~~/shared/wpComponentRegistry'

export default defineEventHandler(() => {
  return {
    ok: true,
    totalEntries: wpComponentRegistry.length,
    categories: getCategories(),
    sampleEntry: findRegistryEntry('core/paragraph')?.label
  }
})
