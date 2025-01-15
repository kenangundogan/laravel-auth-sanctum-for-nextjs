// src/components/Navbar.tsx
'use client';

import { useUser } from '@/contexts/UserContext';
import { AuthService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { UserCircle } from 'lucide-react';

export function Navbar() {
    const { user, setUser, loading } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            setUser(null);
            router.push('/login');
        } catch (error) {
            // Hata olsa bile kullanıcıyı login sayfasına yönlendir
            setUser(null);
            router.push('/login');
            console.error('Logout hatası:', error);
        }
    };

    if (loading) {
        return (
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-xl font-semibold text-gray-800">
                            Your App
                        </span>
                    </div>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <UserCircle className="h-6 w-6 text-gray-600" />
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push('/login')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Giriş Yap
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
