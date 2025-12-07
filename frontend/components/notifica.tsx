'use client'
import { useState, useEffect, useRef } from "react";
import { FaBell, FaCheck, FaCommentAlt, FaStar, FaTimes } from "react-icons/fa";

interface Notification {
    id: number;
    type: 'rating' | 'reply' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

export default function NotificationSystem() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mockData: Notification[] = [
            {
                id: 1,
                type: 'rating',
                title: 'Nova Avaliação',
                message: 'João avaliou sua loja com 5 estrelas.',
                time: 'há 5 min',
                read: false
            },
            {
                id: 2,
                type: 'reply',
                title: 'Resposta no Comentário',
                message: 'A loja respondeu sua avaliação.',
                time: 'há 2 horas',
                read: false
            },
            {
                id: 3,
                type: 'system',
                title: 'Bem-vindo!',
                message: 'Complete seu perfil para ganhar destaque.',
                time: 'há 1 dia',
                read: true
            }
        ];
        setNotifications(mockData);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'rating': return <FaStar className="text-yellow-500" />;
            case 'reply': return <FaCommentAlt className="text-blue-500" />;
            default: return <FaBell className="text-gray-500" />;
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans" ref={modalRef}>
            
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-700 animate-in slide-in-from-bottom-5 duration-200">
                    <div className="p-4 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                        <h3 className="font-bold text-gray-800 dark:text-white">Notificações</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs font-semibold text-laranja hover:text-orange-600 flex items-center gap-1 transition-colors"
                            >
                                <FaCheck size={10} /> Marcar lidas
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                                <FaBell size={30} className="mb-2 opacity-20" />
                                <p className="text-sm">Nenhuma notificação.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className={`p-4 border-b border-gray-50 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors relative group ${!notif.read ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1 bg-white dark:bg-zinc-700 p-2 rounded-full h-fit shadow-sm">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-sm ${!notif.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-300'}`}>
                                                    {notif.title}
                                                </h4>
                                                {!notif.read && (
                                                    <span className="w-2 h-2 rounded-full bg-laranja block mt-1.5"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wide">
                                                {notif.time}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeNotification(notif.id);
                                            }}
                                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative w-14 h-14 bg-laranja hover:bg-orange-600 cursor-pointer text-white rounded-full shadow-lg hover:shadow-orange-500/30 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
                <FaBell size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
                
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-back shadow-sm animate-bounce-short">
                        {unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}