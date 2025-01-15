// src/contexts/UserContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeUser = async () => {
            try {
                // Token'ın geçerliliğini kontrol et
                const isValidToken = await AuthService.checkToken();
                if (!isValidToken) {
                    setUser(null);
                    router.push('/login');
                    return;
                }

                const userData = await AuthService.getUser();
                setUser(userData);
            } catch (error) {
                setUser(null);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, [router]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
