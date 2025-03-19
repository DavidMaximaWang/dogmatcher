import { DogResult, useDogsQueryWithDetailsByIds } from '../hooks/useDogQueries';
import DogLocation from './DogLocation';
import styles from '../styles/DogsPage.module.css';

function DogsPage({ page }: { page: DogResult }) {
    const { resultIds } = page;
    const { data, isLoading } = useDogsQueryWithDetailsByIds(resultIds);
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
