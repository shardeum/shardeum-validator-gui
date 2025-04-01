import create from 'zustand'

const stores: any = {}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Create or reuse a store for this key
  if (!stores[key]) {
    stores[key] = create<{ value: T; setValue: (newValue: T | ((prev: T) => T)) => void }>()((set) => ({
      value: JSON.parse(localStorage.getItem(key) ?? JSON.stringify(initialValue)),
      setValue: (newValue: T | ((prev: T) => T)) => {
        set((state) => {
          const valueToStore = typeof newValue === 'function' ? (newValue as (prev: T) => T)(state.value) : newValue

          localStorage.setItem(key, JSON.stringify(valueToStore))
          return { value: valueToStore }
        })
      },
    }))
  }

  // Get current state and setter from the store
  const state = stores[key]((state: { value: T }) => state.value)
  const setState = stores[key](
    (state: { value: T; setValue: (newValue: T | ((prev: T) => T)) => void }) => state.setValue
  )

  // Return as array to match useState pattern
  return [state, setState]
}
