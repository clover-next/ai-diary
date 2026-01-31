import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
    userName: string;
    selectedVoice: string;
    hasCompletedSetup: boolean;
    isAudioEnabled: boolean;
    setUserName: (name: string) => void;
    setSelectedVoice: (voice: string) => void;
    setHasCompletedSetup: (status: boolean) => void;
    setIsAudioEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            userName: '',
            selectedVoice: 'anna',
            hasCompletedSetup: false,
            isAudioEnabled: true,
            setUserName: (name) => set({ userName: name }),
            setSelectedVoice: (voice) => set({ selectedVoice: voice }),
            setHasCompletedSetup: (status) => set({ hasCompletedSetup: status }),
            setIsAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
        }),
        {
            name: 'wordless-diary-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
