import { useState } from 'react';
import { useDogLocationsContext } from '../context/DogsContext';
import { useDogDetails, useDogLocations, useMatchDogs } from '../hooks/useDogQueries';
import DogCard from './DogCard';

const FavoriteDog = () => {
    const { selectedDogIds } = useDogLocationsContext();
    const [matchedDogId, setMatchedDog] = useState<string | undefined>(undefined);

    const dogsMutation = useMatchDogs();

    const { data: dog, isLoading: isFetchingDetails } = useDogDetails(matchedDogId ? [matchedDogId] : undefined);
    const { locations, isLoading: isMatchedDogLocationLoading } = useDogLocations(dog?.[0]?.zip_code ? [dog?.[0]?.zip_code] : undefined);
    const getMatchedDogLocation = () => {
        if (dog?.[0] && locations && !isMatchedDogLocationLoading) {
            return locations[dog?.[0].zip_code];
        }
        return undefined;
    };

    const handleClick = () => {
        dogsMutation.mutate(selectedDogIds, {
            onSuccess: (matchedDog) => {
                setMatchedDog(matchedDog.match);
            },
            onError: (error) => {
                console.error('Failed to match:', error);
            }
        });
    };

    return (
        <div className={'container'}>
            <button onClick={handleClick} disabled={dogsMutation.isPending || selectedDogIds.length === 0 || isFetchingDetails || isMatchedDogLocationLoading}>
                Get Your Favorite Dog
            </button>
            {dog ? <DogCard dog={dog[0]} location={getMatchedDogLocation()} /> : <></>}
        </div>
    );
};

export default FavoriteDog;
