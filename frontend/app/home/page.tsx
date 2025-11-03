'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import EditUserModal from '@/components/modals/EditUserModal';
import { ToastContainer } from 'react-toastify';
import EditUserPass from '@/components/modals/UpdatePassModal';

export default function HomePage() {
    const router = useRouter();
    const [mostrarModal, setMostrar] = useState(false)
    const [mostrarModal1, setMostrar1] = useState(false)

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

            <button 
            className='my-40 mx-100 cursor-pointer border rounded-md p-2 hover:bg-gray-200'
            onClick={() => setMostrar1(true)}
            >TESTE MODAL 1</button>

            <EditUserModal
            mostrar={mostrarModal}
            fechar={() => setMostrar(false)}
            />

            <EditUserPass
            mostrar={mostrarModal1}
            voltar={() => setMostrar1(false)}
            />

            <ToastContainer/>
        </div>
    );
}


