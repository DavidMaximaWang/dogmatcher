import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDogs } from '../hooks/useDogQueries';
import dog from '../services/dog';
import styles from './Sidebar.module.css';

function Sidebar() {
    const result = useDogs({ page: 0, size: 10, sort: 'breed:asc', breeds: ['Affenpinscher'] });
    const total = result.data?.total;
    const [breeds, setBreeds] = React.useState<string[]>([]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

    // Convert breeds to options format for react-select
    const options = breeds.map((breed) => ({
        value: breed,
        label: breed.charAt(0).toUpperCase() + breed.slice(1) // Capitalize first letter
    }));

    const handleChange = (selectedOptions: any) => {
        const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setSelectedBreeds(values);
        console.log('Selected Breeds:', values);
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
            <Select options={options} isMulti onChange={handleChange} value={options.filter((option) => selectedBreeds.includes(option.value))} placeholder="Select breeds..." className="breed-select" />
        </aside>
    );
}

export default Sidebar;
