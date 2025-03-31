import { useAuth } from '../context/AuthContext';
import SearchResults from './SearchResults';

function ProfilePage() {
    const { user } = useAuth();
    if (!user) {
        return <></>;
    }

    return (
        <div>
            <SearchResults />
        </div>
    );
}

export default ProfilePage;
