import { useParams, useSearchParams } from 'react-router-dom';
import { Location } from '../types';
import styles from '../styles/DogLocation.module.css';
import { useState } from 'react';
// src/styles/DogLocation.module.css

function DogLocation({ location, dogId, favoritedDog }: { location: Location | undefined, dogId: string, favoritedDog?: boolean }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isChecked, setIsChecked] = useState(false);
    const { id: dogIdInUrl } = useParams<{ id: string }>();
    const inDogDetailsPage = dogIdInUrl;

    const handleChange = () => {
        if (!location?.zip_code) {
            return;
        }
        if (!isChecked) {
            searchParams.set('zipCodes', location.zip_code);
            setSearchParams(searchParams);
        } else {
            searchParams.delete('zipCodes');
            setSearchParams(searchParams);
        }
        setIsChecked((prev) => !prev);
    };
    if (!location) {
        return null;
    }
    return (
        <div title="Click to filter by location" className={`${styles.locationRow} ${isChecked ? styles.locationOnly : ''}`}>
            {!inDogDetailsPage ? (
                <>
                    <input type="checkbox" id={`${dogId}_${favoritedDog ? 'favoritedDog' : ''}`} name={location.zip_code} style={{ display: 'none' }} onChange={handleChange} />
                    <label htmlFor={`${dogId}_${favoritedDog ? 'favoritedDog' : ''}`}>
                        {location.city}, {location.state} ({location.zip_code})
                    </label>
                </>
            ) : (
                <p>
                    {location.city}, {location.state} ({location.zip_code})
                </p>
            )}
        </div>
    );
}

export default DogLocation;
