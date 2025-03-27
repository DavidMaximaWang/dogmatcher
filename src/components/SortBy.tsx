import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import styles from '../styles/SortBy.module.css';
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
    const sortFromParams = searchParams.get('sort');
    const [sortKey, sortOrder] = sortFromParams ? sortFromParams.split(":") : ["breed", "asc"];
    const [selectedOption, setSelectedOption] = useState(options.find(v=> v.value === sortKey));
    const [isAscending, setIsAscending] = useState(sortOrder === 'asc');

    const handleSortAsc = () => {
        const newSort = selectedOption ? `${selectedOption.value}:${isAscending ? 'desc' : 'asc'}` : '';
        searchParams.set('sort', newSort);
        setSearchParams(searchParams);
        setIsAscending((prev) => !prev);
    };
    const handleChange = (newValue: SingleValue<OptionType>) => {
        if (!newValue) {
            return;
        }
        const newSort = `${newValue.value}:${isAscending ? 'asc' : 'desc'}`;
        searchParams.set('sort', newSort);

        setSearchParams(searchParams);
        setSelectedOption(newValue);
    };

    return (
        <div className={styles.sortByContainer}>
            <Select defaultValue={selectedOption} onChange={handleChange} options={options} className={styles.select}/>{' '}
            <button onClick={handleSortAsc} className={styles.btn}>
                {isAscending ? '▲' : '▼'}
            </button>
        </div>
    );
}

export default SortBy;
