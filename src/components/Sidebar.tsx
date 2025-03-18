import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDogs } from '../hooks/useDogQueries';
import dog from '../services/dog';
import styles from './Sidebar.module.css';
import SortBy from './SortBy';
import { useSearchParams } from 'react-router-dom';

function Sidebar() {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedBreeds = searchParams.get('breeds')?.split(',') || [];

    const result = useDogs({ page: 0, size: 10, sort: 'breed:asc', breeds: selectedBreeds });
    const total = result.data?.total;
    const [breeds, setBreeds] = useState<string[]>([]);

    const options = breeds.map((breed) => ({
        value: breed,
        label: breed.charAt(0).toUpperCase() + breed.slice(1)
    }));

    const handleBreedChange = (selectedOptions: any) => {
        const breeds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        searchParams.set('breeds', breeds);

        setSearchParams(searchParams);
    };
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
    return (
        <aside className={styles.aside}>
            {total && <div> Total dogs found: {total}</div>}
            <SortBy />
            <Select options={options} isMulti onChange={handleBreedChange} value={options.filter((option) => selectedBreeds.includes(option.value))} placeholder="Select breeds..." className="breed-select" />
        </aside>
    );
}

export default Sidebar;
