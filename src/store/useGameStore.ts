import { create } from "zustand";

export type GamePhase = "INTRO" | "PLAYING" | "OVERLAY_ACTIVE" | "SKIP_MODE";

interface GameState {
  phase: GamePhase;
  activeChallenge: string | null;
  completedChallenges: string[];
  setPhase: (phase: GamePhase) => void;
  enterZone: (zoneId: string) => void;
  leaveZone: () => void;
  solveChallenge: (zoneId: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: "INTRO",
  activeChallenge: null,
  completedChallenges: JSON.parse(localStorage.getItem("completedChallenges") || "[]"),
  
  setPhase: (phase) => {
    set({ phase });
  },
  
  enterZone: (zoneId) => {
    set({ activeChallenge: zoneId, phase: "OVERLAY_ACTIVE" });
  },
  
  leaveZone: () => {
    set({ activeChallenge: null, phase: "PLAYING" });
  },
  
  solveChallenge: (zoneId) => {
    set((state) => {
      const nextCompleted = state.completedChallenges.includes(zoneId)
        ? state.completedChallenges
        : [...state.completedChallenges, zoneId];
      localStorage.setItem("completedChallenges", JSON.stringify(nextCompleted));
      return {
        completedChallenges: nextCompleted,
        activeChallenge: null,
        phase: "PLAYING",
      };
    });
  },

  resetGame: () => {
    localStorage.removeItem("completedChallenges");
    set({
      phase: "PLAYING",
      activeChallenge: null,
      completedChallenges: [],
    });
  }
}));
