import { useState } from 'react';
import { useDogContext } from '../context/DogsContext';
import { useDogDetails, useDogLocations, useMatchDogs } from '../hooks/useDogQueries';
import DogCard from './DogCard';

const FavoriteDog = () => {
    const { selectedDogIds } = useDogContext();
    const [matchedDogId, setMatchedDog] = useState<string | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null)

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
                setError(null);
            },
            onError: (error) => {
                console.error('Failed to match:', error);
                setError(error);
            }
        });
    };

    return (
        <div className={'container'}>
            <button onClick={handleClick} disabled={dogsMutation.isPending || selectedDogIds.length === 0 || isFetchingDetails || isMatchedDogLocationLoading}>
                {selectedDogIds.length === 0 ? 'Please favorite dogs on the right' : dogsMutation.isPending || isFetchingDetails || isMatchedDogLocationLoading ? 'Mathing in progress' : `Get Your Favorite Dog`}
            </button>
            {dog ? <DogCard dog={dog[0]} favoritedDog={true} location={getMatchedDogLocation()} /> : error ? <div>{error.message}</div> : <></>}
        </div>
    );
};

export default FavoriteDog;
