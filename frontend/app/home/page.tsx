'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import EditUserModal from '@/components/modals/EditUserModal';
import { ToastContainer } from 'react-toastify';

export default function HomePage() {
    const router = useRouter();
    const [mostrarModal, setMostrar] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); 
        }
    }, []);


    return (
        <div>
            <Navbar/>

            <button 
            className='my-40 mx-40 cursor-pointer border rounded-md p-2 hover:bg-gray-200'
            onClick={() => setMostrar(true)}
            >TESTE MODAL</button>

            <EditUserModal
            mostrar={mostrarModal}
            fechar={() => setMostrar(false)}
            />
            <ToastContainer/>
        </div>
    );
}


