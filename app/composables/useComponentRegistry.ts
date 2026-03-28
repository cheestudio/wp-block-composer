import type { ComponentCategory, RegistryEntry } from '~~/shared/wpComponentRegistry'
import { wpComponentRegistry, findRegistryEntry, getEntriesByCategory, getCategories, searchRegistry } from '~~/shared/wpComponentRegistry'

export function useComponentRegistry() {
  const searchQuery = ref('')

  const filteredEntries = computed((): RegistryEntry[] => {
    if (!searchQuery.value.trim()) return wpComponentRegistry
    return searchRegistry(searchQuery.value)
  })

  function search(query: string): RegistryEntry[] {
    return searchRegistry(query)
  }

  function getByCategory(category: ComponentCategory): RegistryEntry[] {
    return getEntriesByCategory(category)
  }

  function lookup(name: string): RegistryEntry | undefined {
    return findRegistryEntry(name)
  }

  const categories = getCategories()

  return {
    searchQuery,
    filteredEntries,
    search,
    getByCategory,
    lookup,
    categories
  }
}
