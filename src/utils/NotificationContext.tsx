import React, {createContext, useState, useContext} from 'react';

interface NotificationCounts {
  resourceAndGuide: number;
  newsBoard: number;
  invoice: number;
}

const NotificationContext = createContext<{
  counts: NotificationCounts;
  updateCount: (type: keyof NotificationCounts, value: number) => void;
  resetCount: (type: keyof NotificationCounts) => void;
}>({
  counts: {resourceAndGuide: 0, newsBoard: 0, invoice: 0},
  updateCount: () => {},
  resetCount: () => {},
});

export const NotificationProvider = ({children}) => {
  const [counts, setCounts] = useState<NotificationCounts>({
    resourceAndGuide: 0,
    newsBoard: 0,
    invoice: 0,
  });

  const updateCount = (type: keyof NotificationCounts, value: number) => {
    setCounts(prev => ({...prev, [type]: prev[type] + value}));
  };

  const resetCount = (type: keyof NotificationCounts) => {
    setCounts(prev => ({...prev, [type]: 0}));
  };

  return (
    <NotificationContext.Provider value={{counts, updateCount, resetCount}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
