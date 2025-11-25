import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { User } from '../../database/database';

const STORAGE_KEY = 'currentUser';

interface UserContextValue {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCurrentUserState(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Restore user error:', error);
      } finally {
        setRestoring(false);
      }
    };
    restoreUser();
  }, []);

  const setCurrentUser = async (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  const logout = async () => {
    await setCurrentUser(null);
  };

  if (restoring) {
    return null;
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

