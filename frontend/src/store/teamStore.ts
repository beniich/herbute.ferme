import { create } from 'zustand';
import { Team } from '@/types';

interface TeamState {
    teams: Team[];
    setTeams: (teams: Team[]) => void;
    updateTeamStatus: (teamId: string, status: Team['status']) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
    teams: [],
    setTeams: (teams) => set({ teams }),
    updateTeamStatus: (teamId, status) =>
        set((state) => ({
            teams: state.teams.map((team) =>
                team._id === teamId ? { ...team, status } : team
            )
        }))
}));
