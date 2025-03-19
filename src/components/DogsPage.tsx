import { useEffect } from 'react';
import { useDogLocationsContext } from '../context/DogsLocationContext';
import { DogResult, useDogsQueryWithDetailsByIds } from '../hooks/useDogQueries';
import styles from '../styles/DogsPage.module.css';
import DogLocation from './DogLocation';

function DogsPage({ page, isLastPage, isFirstPage }: { page: DogResult, isLastPage: boolean, isFirstPage: boolean }) {
    const {addLocations, initAddLocations} = useDogLocationsContext()
    const { resultIds } = page;
    const { data, isLoading } = useDogsQueryWithDetailsByIds(resultIds);
    useEffect(() => {
        if (isFirstPage && data.locationsData && Object.keys(data.locationsData).length) {
            initAddLocations(data.locationsData);
        }
        if (isLastPage && !isFirstPage && data.locationsData && Object.keys(data.locationsData).length) {
            addLocations(data.locationsData);
        }

    }, [addLocations, initAddLocations, data.locationsData, isLastPage, isFirstPage]);
    if (isLoading) {
        return <p>Loading dogs...</p>;
    }

    return (
        <>
            {data.dogDetailsArray.map((dog) => {
                if (!dog) {
                    return null;
                }
                return (
                    <div className={styles.dogCard} key={dog.id}>
                        <img src={dog.img} alt="Dog" />
                        <div className={styles.dogInfo}>
                            <h3>{dog.name}</h3>
                            <p>Breed: {dog.breed}</p>
                            <p>Age: {dog.age} years</p>
                            <DogLocation location={data.locationsData[dog.zip_code]} />
                            <span className={styles.heart}>&hearts;</span>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default DogsPage;
