import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SearchResults from './SearchResults';
import UserProfileEditor from './UserProfileEditor';

function ProfilePage() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    if (!user) {
        return <></>;
    }

    return (
        <div>
            <button onClick={() => setEditing(!editing)}>{editing ? 'Close Profile Editor' : 'Edit Profile'}</button>

            {editing && <UserProfileEditor />}
            <SearchResults />
        </div>
    );
}

export default ProfilePage;
