import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDogDetails, useDogLocations, useDogs } from '../hooks/useDogQueries';
import DogLocation from './DogLocation';
import styles from './SearchResults.module.css';

const DEFAULT_PARAMS = {
    size: '10',
    from: '0',
    sort: 'breed:asc',
    breeds: 'Malinois'
};

function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!searchParams.get('size')) searchParams.set('size', DEFAULT_PARAMS.size);
        if (!searchParams.get('from')) searchParams.set('from', DEFAULT_PARAMS.from);
        if (!searchParams.get('sort')) searchParams.set('sort', DEFAULT_PARAMS.sort);
        if (!searchParams.get('breeds')) searchParams.set('breeds', DEFAULT_PARAMS.breeds);

        setSearchParams(searchParams);
    }, [searchParams, setSearchParams]);

    const size = Number(searchParams.get('size') || DEFAULT_PARAMS.size);
    const from = Number(searchParams.get('from') || DEFAULT_PARAMS.from);
    const sort = searchParams.get('sort') || DEFAULT_PARAMS.sort;
    const selectedBreeds = (searchParams.get('breeds') || 'Malinois')?.split(',');

    const { data: result, isLoading } = useDogs({
        page: from,
        size,
        sort,
        breeds: selectedBreeds
    });

    const { next, resultIds = [] } = result || {};
    const { data: dogDetailsArray = [], zipCodes = [] } = useDogDetails(resultIds);

    const locationsData = useDogLocations(zipCodes);

    if (isLoading) {
        return <p>Loading dogs...</p>;
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
