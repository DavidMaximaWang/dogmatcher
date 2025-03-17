import { useDogDetails, useDogLocations, useDogs } from '../hooks/useDogQueries';
import DogLocation from './DogLocation';
import styles from './SearchResults.module.css';

function SearchResults() {
    const result = useDogs({ page: 0, size: 10, sort: 'breed:asc', breeds: ['Affenpinscher'] });
    console.log(result);
    const { next, resultIds = [] } = result.data || {};

    const { data: dogDetailsArray = [], zipCodes = [] } = useDogDetails(resultIds);

    const locationsData = useDogLocations(zipCodes);

    return (
        <div className={styles.dogsGridWrapper}>
            <div className={styles.dogsGrid}>
                {dogDetailsArray &&
                    dogDetailsArray.map((dog) => (
                        <div className={styles.dogCard} key={dog.id}>
                            <img src={dog.img} alt="Dog" />
                            <div className={styles.dogInfo}>
                                <h3>{dog.name}</h3>
                                <p>Breed: {dog.breed}</p>
                                <p>Age: {dog.age} years</p>
                                <DogLocation location={locationsData[dog.zip_code]} />
                                <span className={styles.heart}>&hearts;</span>
                            </div>
                        </div>
                    ))}
            </div>
            <div className={styles.loadMore}>
                <button>Load More</button>
            </div>
        </div>
    );
}

export default SearchResults;
