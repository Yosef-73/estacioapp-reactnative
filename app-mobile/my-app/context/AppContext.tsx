import React, { createContext, useContext, useState } from 'react';
import {
  groups,
  assistants,
  missions,
  initialCompletions,
  Completion,
} from '../data/mockData';

interface AppContextType {
  groups: typeof groups;
  assistants: typeof assistants;
  missions: typeof missions;
  completions: Completion[];
  addCompletion: (assistantId: string, missionId: string) => void;
  getAssistantPoints: (assistantId: string) => number;
  getGroupPoints: (groupId: string) => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [completions, setCompletions] = useState<Completion[]>(initialCompletions);

  const addCompletion = (assistantId: string, missionId: string) => {
    const newCompletion: Completion = {
      id: `c${Date.now()}`,
      assistantId,
      missionId,
      date: new Date().toISOString().split('T')[0],
    };
    setCompletions(prev => [...prev, newCompletion]);
  };

  const getAssistantPoints = (assistantId: string) =>
    completions
      .filter(c => c.assistantId === assistantId)
      .reduce((sum, c) => {
        const mission = missions.find(m => m.id === c.missionId);
        return sum + (mission?.points ?? 0);
      }, 0);

  const getGroupPoints = (groupId: string) =>
    assistants
      .filter(a => a.groupId === groupId)
      .reduce((sum, a) => sum + getAssistantPoints(a.id), 0);

  return (
    <AppContext.Provider
      value={{
        groups,
        assistants,
        missions,
        completions,
        addCompletion,
        getAssistantPoints,
        getGroupPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
