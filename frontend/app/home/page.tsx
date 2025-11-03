'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function HomePage() {
    const router = useRouter();
    const [foundToken, setFoundToken] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); 
        } else {
            setFoundToken(true);
        }
    }, []);
    
    return (
        <main>
            <Navbar
            Logado={foundToken}
            />
            <h1>Bem-vindo a home page de usuário autenticado</h1>
        </main>
    );
}


