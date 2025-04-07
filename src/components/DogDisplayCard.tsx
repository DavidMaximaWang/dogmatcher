import styles from '../styles/DogsCard.module.css';
import { Dog, Location } from '../types';
import DogLocation from './DogLocation';

function DogCard({ dog, location, favoritedDog }: { dog: Dog; location?: Location | undefined; favoritedDog?: boolean }) {
    return (
        <div className={styles.dogCard} key={dog.id}>
            <img src={dog.img} alt="Dog" loading="lazy" />

            <div className={styles.dogInfo}>
                <h3>{dog.name}</h3>
                <p className={styles.unauthed}>Breed: {dog.breed}</p>
                <p>Age: {dog.age} years</p>
                {location && <DogLocation location={location} dogId={dog.id} favoritedDog={favoritedDog} />}
            </div>
        </div>
    );
}

export default DogCard;
