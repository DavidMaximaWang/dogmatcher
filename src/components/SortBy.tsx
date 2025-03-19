import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import styles from '../styles/Sortby.module.css';
import { useSearchParams } from 'react-router-dom';

const options = [
    { value: 'age', label: 'Age' },
    { value: 'breed', label: 'Breed' },
    { value: 'name', label: 'Name' }
];

type OptionType = {
    value: string;
    label: string;
};

function SortBy() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedOption, setSelectedOption] = useState({ value: 'breed', label: 'Breed' });
    const [isAscending, setIsAscending] = useState(true);

    const handleSortAsc = () => {
        const newSort = `${selectedOption.value}:${!isAscending ? 'desc' : 'asc'}`;
        searchParams.set('sort', newSort);
        setSearchParams(searchParams);
        setIsAscending((prev) => !prev);
    };
    const handleChange = (newValue: SingleValue<OptionType>) => {
        const newSort = `${newValue.value}:${isAscending ? 'asc' : 'desc'}`;
        searchParams.set('sort', newSort);

        setSearchParams(searchParams);
        setSelectedOption(newValue);
    };

    return (
        <div className={styles.sortByContainer}>
            <Select defaultValue={selectedOption} onChange={handleChange} options={options} />{' '}
            <button onClick={handleSortAsc} className={styles.btn}>
                {isAscending ? '▲' : '▼'}
            </button>
        </div>
    );
}

export default SortBy;
