'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function HomePage() {
    const router = useRouter();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
        router.push('/login'); // redireciona se não tiver token
        }
    }, []);
    
    return (
        <main>
            <Navbar
            Logado={!!token}
            />
            <h1>Bem-vindo a home page de usuário autenticado</h1>
        </main>
    );
}


