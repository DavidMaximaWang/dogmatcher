import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext'; // or however you're accessing auth
import { useParams } from 'react-router-dom';

function UserProfileEditor() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const {uid} = useParams()
    console.log('uid', uid)

    useEffect(() => {
        if (user?.uid) {
            const fetchProfile = async () => {
                const ref = doc(db, 'users', user.uid);
                const snap = await getDoc(ref);
                setProfile(snap.data());
                setLoading(false);
            };
            fetchProfile();
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!uid) return;
        const ref = doc(db, 'users', uid);
        await updateDoc(ref, {
            displayName: profile.displayName,
        });
        alert('Profile updated!');
    };

    if (loading) return <p>Loading profile...</p>;
    if (!profile) return <p>No profile found.</p>;

    return (
        <div style={{ padding: 20, maxWidth: 400 }}>
            <h2>Edit Profile</h2>

            <label>Display Name:</label>
            <input type="text" name="displayName" value={profile.displayName || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} />

            {/* <label>Photo URL:</label>
            <input type="text" name="photoURL" value={profile.photoURL || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /> */}

            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default UserProfileEditor;
