import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path if necessary

const ChatDetails: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', id as string));
                    if (userDoc.exists()) {
                        setUser({ id: userDoc.id, ...userDoc.data() });
                    }
                } catch (error) {
                    console.error('Error fetching user: ', error);
                }
            }
        };

        fetchUser();
    }, [id]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { sender: 'me', text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            {user ? (
                <>
                    <h2 className="text-2xl mb-4">{user.name}</h2>
                    <div className="flex flex-col h-screen">
                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500">Loading user details...</p>
            )}
        </div>
    );
};

export default ChatDetails;
