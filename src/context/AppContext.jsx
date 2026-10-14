import React, { createContext, useContext } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Part 1 State
  const [tasks, setTasks] = usePersistentState('focushub_tasks', []);
  const [deadlines, setDeadlines] = usePersistentState('focushub_deadlines', []);
  const [habits, setHabits] = usePersistentState('focushub_habits', []);
  const [theme, setTheme] = usePersistentState('focushub_theme', 'dark');

  // Part 2 State
  const [mathHistory, setMathHistory] = usePersistentState('focushub_math_history', []);
  const [memoryHistory, setMemoryHistory] = usePersistentState('focushub_memory_history', []);
  const [flashcards, setFlashcards] = usePersistentState('focushub_flashcards', []);
  const [mistakes, setMistakes] = usePersistentState('focushub_mistakes', []);

  const performSearch = (query) => {
    if (!query) return [];
    const q = query.toLowerCase();
    const foundTasks = tasks.filter(t => t.text.toLowerCase().includes(q)).map(t => ({ ...t, type: 'Task' }));
    const foundDeadlines = deadlines.filter(d => d.name.toLowerCase().includes(q)).map(d => ({ ...d, type: 'Deadline' }));
    const foundCards = flashcards.filter(c => c.question.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q)).map(c => ({ ...c, type: 'Flashcard' }));
    return [...foundTasks, ...foundDeadlines, ...foundCards];
  };

  const value = {
    tasks, setTasks,
    deadlines, setDeadlines,
    habits, setHabits,
    theme, setTheme,
    mathHistory, setMathHistory,
    memoryHistory, setMemoryHistory,
    flashcards, setFlashcards,
    mistakes, setMistakes,
    performSearch
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);