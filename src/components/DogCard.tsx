import { Link, useSearchParams } from 'react-router-dom';
import { useDogContext } from '../context/DogsContext';
import styles from '../styles/DogsCard.module.css';
import { Dog, Location } from '../types';
import DogLocation from './DogLocation';

function DogCard({ dog, location, favoritedDog }: {dog: Dog, location: Location | undefined, favoritedDog?:  boolean}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const {selectedDogIds ,toggleSelectDog } = useDogContext();
    const handleToggleSelectedDog = () => toggleSelectDog(dog.id);
    const isDogSelected = selectedDogIds.includes(dog.id);

    const handleBreedSelect = () => {
        searchParams.set('breeds', dog.breed);
        setSearchParams(searchParams);
    }

    return (
        <div className={styles.dogCard} key={dog.id}>
            <Link to={`/dogs/${dog.id}`}>
                <img src={dog.img} alt="Dog" loading='lazy'/>
            </Link>
            <div className={styles.dogInfo}>
                <h3>{dog.name}</h3>
                <p onClick={handleBreedSelect} className={styles.breeds}>Breed: {dog.breed}</p>
                <p>Age: {dog.age} years</p>
                <DogLocation location={location} dogId={dog.id} favoritedDog={favoritedDog}/>
                <span className={`${styles.heart} ${isDogSelected ? styles.selected: ''}`} onClick={handleToggleSelectedDog}>
                    &hearts;
                </span>
            </div>
        </div>
    );
}

export default DogCard;