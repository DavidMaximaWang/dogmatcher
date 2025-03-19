import { useDogLocationsContext } from '../context/DogsLocationContext';
import styles from '../styles/DogsCard.module.css';
import DogLocation from './DogLocation';

function DogCard({ dog, location }) {
    const {selectedDogIds ,toggleSelectDog } = useDogLocationsContext();
    const handleToggleSelectedDog = () => toggleSelectDog(dog.id);
    const isDogSelected = selectedDogIds.includes(dog.id);

    return (
        <div className={styles.dogCard} key={dog.id}>
            <img src={dog.img} alt="Dog" />
            <div className={styles.dogInfo}>
                <h3>{dog.name}</h3>
                <p>Breed: {dog.breed}</p>
                <p>Age: {dog.age} years</p>
                <DogLocation location={location} />
                <span className={`${styles.heart} ${isDogSelected ? styles.selected: ''}`} onClick={handleToggleSelectedDog}>
                    &hearts;
                </span>
            </div>
        </div>
    );
}

export default DogCard;
