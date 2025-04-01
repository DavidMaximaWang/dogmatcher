import { Link, useSearchParams } from 'react-router-dom';
import { useDogContext } from '../context/DogsContext';
import styles from '../styles/DogsCard.module.css';
import { Dog, Location } from '../types';
import DogLocation from './DogLocation';
import { useAuth } from '../context/AuthContext';

function DogCard({ dog, location, favoritedDog }: {dog: Dog, location?: Location | undefined, favoritedDog?:  boolean}) {
    const {user} = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const {selectedDogIds ,toggleSelectDog } = useDogContext();
    const handleToggleSelectedDog = () => toggleSelectDog(dog.id);
    const isDogSelected = selectedDogIds.includes(dog.id);
    const zipCodes = searchParams.get('zipCodes');
    const query = zipCodes ? `?zipCodes=${encodeURIComponent(zipCodes)}` : '';

    const handleBreedSelect = () => {
        if (!user) {
            return;
        }
        searchParams.set('breeds', dog.breed);
        setSearchParams(searchParams);
    }

    return (
        <div className={styles.dogCard} key={dog.id}>
            {user ? (
                <Link to={`/dogs/${dog.id}${query}`}>
                    <img src={dog.img} alt="Dog" loading="lazy" />
                </Link>
            ) : (
                <img src={dog.img} alt="Dog" loading="lazy" />
            )}

            <div className={styles.dogInfo}>
                <h3>{dog.name}</h3>
                <p onClick={handleBreedSelect} className={`${!user ? styles.unauthed : styles.breeds}`}>
                    Breed: {dog.breed}
                </p>
                <p>Age: {dog.age} years</p>
                {location && <DogLocation location={location} dogId={dog.id} favoritedDog={favoritedDog} />}
                {user ? <span className={`${styles.heart} ${isDogSelected ? styles.selected : ''}`} onClick={handleToggleSelectedDog}>
                    &hearts;
                </span> : null}
            </div>
        </div>
    );
}

export default DogCard;