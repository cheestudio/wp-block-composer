import type { ComponentCategory, ComponentContext, RegistryEntry } from '~~/shared/wpComponentRegistry'
import { wpComponentRegistry, findRegistryEntry, getEntriesByCategory, getEntriesByContext, getCategories, searchRegistry } from '~~/shared/wpComponentRegistry'

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

  function getByContext(context: ComponentContext): RegistryEntry[] {
    return getEntriesByContext(context)
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
    getByContext,
    lookup,
    categories
  }
}
