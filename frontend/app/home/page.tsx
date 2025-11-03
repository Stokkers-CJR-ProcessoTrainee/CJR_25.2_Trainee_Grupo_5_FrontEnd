'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import EditUserModal from '@/components/modals/EditUserModal';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); 
        }
    }, []);
    
    return (
        <div>
            <Navbar/>
            <EditUserModal/>
        </div>
    );
}


