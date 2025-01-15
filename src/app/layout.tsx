// src/app/layout.tsx
import { UserProvider } from '@/contexts/UserContext';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <UserProvider>
                    <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <main className="container mx-auto px-4 py-8">
                            {children}
                        </main>
                    </div>
                </UserProvider>
            </body>
        </html>
    );
}
