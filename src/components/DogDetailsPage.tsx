import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDogContext } from '../context/DogsContext';
import { useDogsQueryWithDetailsByIds } from '../hooks/useDogQueries';
import styles from '../styles/DogsDetails.module.css';
import SearchResults from './SearchResults';

function DogDetailsPage() {

    const { total, searchResultLoaded } = useDogContext();
    const { id: dogId } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isLoading } = useDogsQueryWithDetailsByIds(dogId ? [dogId] : []);
    const [dogsInLocation, setDogsInLocation] = useState<boolean>(false);
    const [dogsSearchInitialed, setDogsSearchInitialed] = useState<boolean>(false);

    useEffect(() => {
        if (dogId) {
            setDogsSearchInitialed(false);
            setDogsInLocation(false);
        }
    }, [dogId, setDogsSearchInitialed, setDogsInLocation]);

    if (isLoading) {
        return <div> Loading...</div>;
    }


    const dog = data.dogDetailsArray[0];
    const location = data.locationsData[data.zipCodes[0]];
    const handleLocationClick = () => {
        if (!location?.zip_code) {
            return;
        }

        searchParams.set('zipCodes', location.zip_code);
        setSearchParams(searchParams, { replace: true }); // won't add new location history, prevent user from seeing searched dogs with all locations

        setDogsInLocation(!dogsInLocation);
        setDogsSearchInitialed(true);
    };

    return (
        <div className={styles.dogDetail} key={dog.id}>
            <img src={dog.img} alt="Dog" loading="lazy" />

            <div className={styles.dogInfo}>
                <h3>{dog.name}</h3>
                <p>Breed: {dog.breed}</p>
                <p>Age: {dog.age} years</p>
                <div className={styles.detailsLocation} onClick={handleLocationClick}>
                    {location.city}, {location.state} ({location.zip_code})
                </div>
                {dogsSearchInitialed ? (
                    <div className={`${!dogsInLocation ? styles.hideDog : ''}`}>
                        {searchResultLoaded && total && total > 1 ? <p>Total Dogs Found: {total}</p> : <p> No more dogs in this location</p>}
                        <SearchResults />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default DogDetailsPage;