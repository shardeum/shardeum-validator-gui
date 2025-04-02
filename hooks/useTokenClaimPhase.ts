import { create } from 'zustand'

interface TokenClaimPhaseStore {
  tokenClaimPhase: number
  setTokenClaimPhase: (phase: number) => void
}

export const useTokenClaimPhase = create<TokenClaimPhaseStore>((set) => ({
  tokenClaimPhase: -1,
  setTokenClaimPhase: (phase) => set({ tokenClaimPhase: phase }),
}))
