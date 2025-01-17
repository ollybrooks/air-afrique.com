import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TimeContextType {
  visitTime: Date;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export function TimeProvider({ children }: { children: ReactNode }) {
  const [visitTime] = useState(new Date());

  return (
    <TimeContext.Provider value={{ visitTime }}>
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
}
