'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
        router.push('/login'); // redireciona se não tiver token
        }
    }, []);
    
    return (
        <main>
            <h1>Bem-vindo a home page de usuário autenticado</h1>
        </main>
    );
}


