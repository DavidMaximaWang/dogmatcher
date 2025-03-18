import { Location } from '../types';

function DogLocation({ location }: { location: Location | null }) {
    if (!location) {
        return null;
    }
    return (
        <p>
            <span> Location: {location.city} </span> <span> {location.state} </span> <span> ({location.zip_code})</span>{' '}
        </p>
    );
}

export default DogLocation;
