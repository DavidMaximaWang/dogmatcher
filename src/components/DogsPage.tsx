import { useEffect } from 'react';
import { useDogContext } from '../context/DogsContext';
import { DogResult, useDogsQueryWithDetailsByIds } from '../hooks/useDogQueries';
import DogCard from './DogCard';

function DogsPage({ page, isLastPage, isFirstPage }: { page: DogResult, isLastPage: boolean, isFirstPage: boolean }) {
    const {addLocations, initAddLocations} = useDogContext()
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
                    <DogCard key={dog.id} dog={dog} location = {data.locationsData[dog.zip_code]}/>

                );
            })}
        </>
    );
}

export default DogsPage;
