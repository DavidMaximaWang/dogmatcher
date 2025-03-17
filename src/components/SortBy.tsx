import { useState } from 'react';
import Select, { SingleValue } from 'react-select';

import styles from './Sortby.module.css';
const options = [
    { value: 'Age', label: 'Age' },
    { value: 'Breed', label: 'Breed' },
    { value: 'size', label: 'Size' }
];

type OptionType = {
    value: string;
    label: string;
};

function SortBy() {
    const [selectedOption, setSelectedOption] = useState({ value: 'Breed', label: 'Breed' });
    const [isAscending, setIsAscending] = useState(true);

    const handleSortAsc = () => {
        setIsAscending((prev) => !prev);
    };
    const handleChange = (newValue: SingleValue<OptionType>) => {
        setSelectedOption(newValue);
    };
    return (
        <div className={styles.sortByContainer}>
            <Select defaultValue={selectedOption} onChange={handleChange} options={options} /> <button onClick={handleSortAsc} className={styles.btn}>{isAscending ? '▲' : '▼'}</button>
        </div>
    );
}

export default SortBy;
