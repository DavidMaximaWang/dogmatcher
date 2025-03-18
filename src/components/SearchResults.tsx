import { useSearchParams } from 'react-router-dom';
import { useDogDetails, useDogLocations, useDogs } from '../hooks/useDogQueries';
import DogLocation from './DogLocation';
import styles from './SearchResults.module.css';
import buildDogSearchQuery from '../utils';


function SearchResults() {
    const [searchParams] = useSearchParams();

    // const size = Number(searchParams.get('size') || DEFAULT_PARAMS.size);
    // const from = Number(searchParams.get('from') || DEFAULT_PARAMS.from);
    // const sort = searchParams.get('sort') || DEFAULT_PARAMS.sort;
    // const selectedBreeds = (searchParams.get('breeds') || '')?.split(',');
    // const selectedZipCodes = (searchParams.get('zipCodes') || '')?.split(',').filter(Boolean);
    const dogsQuery = buildDogSearchQuery(searchParams);
    // console.log('dogsQuery in SearchResults', dogsQuery);

    const { data: result, isLoading } = useDogs(dogsQuery);
    console.log('result in SearchResults: ',result)

    const { resultIds = [] } = result || {};
    const { data: dogDetailsArray = [], zipCodes = [] } = useDogDetails(resultIds);
    console.log('zipCodes in SearchResults: ',zipCodes)
    const locationsData = useDogLocations(zipCodes);

    if (isLoading || !dogDetailsArray.length) {
        return <p className={styles.loading}>Loading dogs...</p>;
    }
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
