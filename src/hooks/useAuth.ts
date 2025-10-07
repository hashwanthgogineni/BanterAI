import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, getCurrentUser } from '@/integrations/firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
