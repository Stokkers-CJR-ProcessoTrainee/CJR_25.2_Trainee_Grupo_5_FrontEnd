'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); 
        }
    }, []);
    
    return (
        <main>
            <Navbar/>
            <h1>Bem-vindo a home page de usuário autenticado</h1>
        </main>
    );
}


