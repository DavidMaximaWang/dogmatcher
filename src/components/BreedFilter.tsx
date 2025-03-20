import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import dog from '../services/dog';

interface BreedOption {
    value: string;
    label: string;
}
function BreedFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [breeds, setBreeds] = useState<string[]>([]);

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const breedsFetched = await dog.getBreeds();
                setBreeds(breedsFetched);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBreeds();
    }, []);

    const selectedBreeds = searchParams.get('breeds')?.split(',') || [];
    const breedOptions = breeds.map((breed) => ({
        value: breed,
        label: breed
    }));
    const handleBreedChange = (selectedOptions: MultiValue<BreedOption>) => {
        const breeds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
        if (breeds.length > 0) {
            searchParams.set('breeds', breeds.join(','));
        } else {
            searchParams.delete('breeds');
        }
        setSearchParams(searchParams);
    };

    return <Select isMulti options={breedOptions} onChange={handleBreedChange} value={breedOptions.filter((option) => selectedBreeds.includes(option.value))} placeholder="Select breeds..." className="breed-select" />;
}

export default BreedFilter;
