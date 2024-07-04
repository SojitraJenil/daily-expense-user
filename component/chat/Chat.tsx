import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { db } from '../../firebase';

const Home: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const fetchedUsers: any[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedUsers.push({ id: doc.id, ...doc.data() });
                });
                console.log(fetchedUsers)
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching users: ', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (id: string) => {
        router.push(`/chatDetails/?${id}`);
    };

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200 text-center"
                        onClick={() => handleUserClick(user.id)}
                    >
                        {user.name}   --- --- ---{user.mobileNumber}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
