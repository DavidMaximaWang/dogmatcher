import { useEffect, useState } from 'react';
import { deleteDoc, collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

type User = {
    id: string;
    email: string;
};

type Dog = {
    id: string;
    name: string;
    breed: string;
    confidence?: number;
    img?: string;
};

function AdminBoard() {
    const { userData } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dogs, setDogs] = useState<Dog[]>([]);

    useEffect(() => {
        if (userData?.role === 'admin') {
            const fetchUsers = async () => {
                const snapshot = await getDocs(collection(db, 'users'));
                const userList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as any)
                })) as User[];
                setUsers(userList);
            };
            fetchUsers();
        }
    }, [userData?.role]);

    useEffect(() => {
        if (selectedUser) {
            const fetchDogs = async () => {
                const q = query(collection(db, 'dogs'), where('owner_id', '==', selectedUser.id));
                const snapshot = await getDocs(q);
                const dogList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as any)
                })) as Dog[];
                setDogs(dogList);
            };
            fetchDogs();
        } else {
            setDogs([]);
        }
    }, [selectedUser]);

    const handleDeleteDog = async (dogId: string) => {
        const confirm = window.confirm('Are you sure you want to delete this dog?');
        if (!confirm) return;

        try {
            await deleteDoc(doc(db, 'dogs', dogId));
            setDogs((prev) => prev.filter((dog) => dog.id !== dogId));
            console.log('Dog deleted successfully');
        } catch (err) {
            console.error('Error deleting dog:', err);
            alert('Failed to delete dog');
        }
    };

    if (userData?.role !== 'admin') {
        return <div>Access denied. Admins only.</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Dashboard</h2>

            <h3>Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <button onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue' }}>
                            {user.email}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <div style={{ marginTop: 32 }}>
                    <h3>Dogs uploaded by {selectedUser.email}</h3>
                    {dogs.length === 0 ? (
                        <p>No dogs found.</p>
                    ) : (
                        <ul>
                            {dogs.map((dog) => (
                                <li key={dog.id} style={{ marginBottom: 12 }}>
                                    <strong>{dog.name}</strong> – {dog.breed} {dog.confidence && `(${(dog.confidence * 100).toFixed(2)}%)`}
                                    {dog.img && (
                                        <div>
                                            <img src={dog.img} alt={dog.name} style={{ width: 200, marginTop: 8 }} />
                                        </div>
                                    )}{' '}
                                    <div style={{ marginTop: 8 }}>
                                        <button onClick={() => handleDeleteDog(dog.id)} style={{ color: 'red', cursor: 'pointer' }}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminBoard;
