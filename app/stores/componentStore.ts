import { v4 as uuidv4 } from 'uuid'
import { findRegistryEntry } from '~~/shared/wpComponentRegistry'

export interface ComponentItem {
  id: string
  registryName: string
  label: string
  parentId: string | null
  order: number
  options: Record<string, unknown>
  notes: string
}

export interface TreeNode {
  item: ComponentItem
  children: TreeNode[]
  depth: number
}

export interface FlatOrderedItem {
  item: ComponentItem
  depth: number
}

export const useComponentStore = defineStore('component', () => {
  const items = ref<ComponentItem[]>([])

  // ── Internal helpers ───────────────────────────────────────

  function getChildren(parentId: string | null): ComponentItem[] {
    return items.value
      .filter(i => i.parentId === parentId)
      .sort((a, b) => a.order - b.order)
  }

  function recomputeSiblingOrders() {
    const parentIds = new Set(items.value.map(i => i.parentId))
    for (const pid of parentIds) {
      items.value
        .filter(i => i.parentId === pid)
        .sort((a, b) => a.order - b.order)
        .forEach((item, idx) => { item.order = idx })
    }
  }

  function collectDescendantIds(id: string): string[] {
    const result: string[] = []
    for (const child of items.value.filter(i => i.parentId === id)) {
      result.push(child.id)
      result.push(...collectDescendantIds(child.id))
    }
    return result
  }

  function collectDescendantsInOrder(parentId: string): ComponentItem[] {
    const result: ComponentItem[] = []
    for (const child of getChildren(parentId)) {
      result.push(child)
      result.push(...collectDescendantsInOrder(child.id))
    }
    return result
  }

  // ── Computed ───────────────────────────────────────────────

  function buildTree(parentId: string | null, depth: number): TreeNode[] {
    return getChildren(parentId).map(item => ({
      item,
      depth,
      children: buildTree(item.id, depth + 1)
    }))
  }

  function buildFlatOrdered(parentId: string | null, depth: number): FlatOrderedItem[] {
    const result: FlatOrderedItem[] = []
    for (const item of getChildren(parentId)) {
      result.push({ item, depth })
      result.push(...buildFlatOrdered(item.id, depth + 1))
    }
    return result
  }

  const asTree = computed(() => buildTree(null, 0))

  const flatOrdered = computed(() => buildFlatOrdered(null, 0))

  const isFlat = computed(() => items.value.every(i => i.parentId === null))

  const isEmpty = computed(() => items.value.length === 0)

  const hasContainerWithoutChildren = computed(() => {
    return items.value.some(item => {
      const entry = findRegistryEntry(item.registryName)
      if (!entry?.canHaveChildren) return false
      return !items.value.some(child => child.parentId === item.id)
    })
  })

  // ── CRUD actions ───────────────────────────────────────────

  function addComponent(registryName: string, options: Record<string, unknown>, notes: string): string | undefined {
    const entry = findRegistryEntry(registryName)
    if (!entry) return undefined

    const id = uuidv4()
    const rootCount = items.value.filter(i => i.parentId === null).length

    items.value.push({
      id,
      registryName,
      label: entry.label,
      parentId: null,
      order: rootCount,
      options,
      notes
    })

    return id
  }

  function updateComponent(id: string, updates: Partial<Pick<ComponentItem, 'options' | 'notes'>>) {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    if (updates.options !== undefined) item.options = updates.options
    if (updates.notes !== undefined) item.notes = updates.notes
  }

  function removeComponent(id: string) {
    const toRemove = new Set([id, ...collectDescendantIds(id)])
    items.value = items.value.filter(i => !toRemove.has(i.id))
    recomputeSiblingOrders()
  }

  function duplicateComponent(id: string) {
    const item = items.value.find(i => i.id === id)
    if (!item) return

    // Snapshot descendants before mutating
    const descendants = collectDescendantsInOrder(id)
    const idMap = new Map<string, string>()

    // Clone the target item
    const newId = uuidv4()
    idMap.set(item.id, newId)

    items.value.push({
      ...item,
      id: newId,
      order: Number.MAX_SAFE_INTEGER,
      options: { ...item.options }
    })

    // Clone descendants with remapped parentIds
    for (const desc of descendants) {
      const descNewId = uuidv4()
      idMap.set(desc.id, descNewId)
      items.value.push({
        ...desc,
        id: descNewId,
        parentId: idMap.get(desc.parentId!) ?? newId,
        options: { ...desc.options }
      })
    }

    recomputeSiblingOrders()
  }

  // ── Reorder ────────────────────────────────────────────────

  function reorder(newFlatOrderedIds: string[]) {
    const posMap = new Map(newFlatOrderedIds.map((id, i) => [id, i]))

    // Group by parentId, sort each group by new visual position, renumber
    const groups = new Map<string | null, ComponentItem[]>()
    for (const item of items.value) {
      const group = groups.get(item.parentId) ?? []
      group.push(item)
      groups.set(item.parentId, group)
    }

    for (const group of groups.values()) {
      group.sort((a, b) => (posMap.get(a.id) ?? 0) - (posMap.get(b.id) ?? 0))
      group.forEach((item, i) => { item.order = i })
    }
  }

  // ── Indent / Outdent ───────────────────────────────────────

  function canIndent(id: string): boolean {
    const item = items.value.find(i => i.id === id)
    if (!item) return false

    const prevSibling = getChildren(item.parentId)
      .filter(s => s.order < item.order)
      .at(-1)

    if (!prevSibling) return false
    return !!findRegistryEntry(prevSibling.registryName)?.canHaveChildren
  }

  function indent(id: string) {
    if (!canIndent(id)) return

    const item = items.value.find(i => i.id === id)!
    const prevSibling = getChildren(item.parentId)
      .filter(s => s.order < item.order)
      .at(-1)!

    item.parentId = prevSibling.id
    item.order = Number.MAX_SAFE_INTEGER
    recomputeSiblingOrders()
  }

  function canOutdent(id: string): boolean {
    const item = items.value.find(i => i.id === id)
    return !!item?.parentId
  }

  function outdent(id: string) {
    const item = items.value.find(i => i.id === id)
    if (!item || !item.parentId) return

    const parent = items.value.find(i => i.id === item.parentId)
    if (!parent) return

    item.parentId = parent.parentId
    item.order = parent.order + 0.5 // place right after parent
    recomputeSiblingOrders()
  }

  // ── Reset ──────────────────────────────────────────────────

  function clearAll() {
    items.value = []
  }

  return {
    items,
    asTree,
    flatOrdered,
    isFlat,
    isEmpty,
    hasContainerWithoutChildren,
    addComponent,
    updateComponent,
    removeComponent,
    duplicateComponent,
    reorder,
    canIndent,
    indent,
    canOutdent,
    outdent,
    clearAll
  }
})
