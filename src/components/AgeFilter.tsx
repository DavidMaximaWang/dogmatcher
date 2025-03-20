import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks';
import styles from '../styles/AgeFilter.module.css';

function AgeFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    const ageMinFromParams = searchParams.get('ageMin') ? parseInt(searchParams.get('ageMin')!) : undefined;
    const ageMaxFromParams = searchParams.get('ageMax') ? parseInt(searchParams.get('ageMax')!) : undefined;

    const [ageRange, setAgeRange] = useState<[number | undefined, number | undefined]>([ageMinFromParams, ageMaxFromParams]);

    const updateSearchParams = useDebounce((min: number | undefined, max: number | undefined) => {
        if (min !== undefined) {
            searchParams.set('ageMin', String(min));
        } else {
            searchParams.delete('ageMin');
        }

        if (max !== undefined) {
            searchParams.set('ageMax', String(max));
        } else {
            searchParams.delete('ageMax');
        }

        setSearchParams(searchParams);
    }, 500);

    const isChangeLegal = (min: number | undefined, max: number | undefined) => {
        if ((min !== undefined && min < 0) || (max !== undefined && max < 0)) {
            return false;
        }
        if (min === undefined || max === undefined) {
            return true;
        }
        return min <= max;
    };

    const handleAgeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? undefined : Math.max(0, Number(e.target.value));
        if (!isChangeLegal(value, ageRange[1])) return;

        setAgeRange([value, ageRange[1]]);
        updateSearchParams(value, ageRange[1]);
    };

    const handleAgeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? undefined : Math.max(0, Number(e.target.value));
        if (!isChangeLegal(ageRange[0], value)) return;

        setAgeRange([ageRange[0], value]);
        updateSearchParams(ageRange[0], value);
    };

    return (
        <>
            <label>Age Range:</label>
            <div className={styles.ageInputs}>
                <input type="number" placeholder="Min Age" value={ageRange[0] ?? ''} onChange={handleAgeMinChange} min="0" max={ageRange[1] || undefined} />
                <span> to </span>
                <input type="number" placeholder="Max Age" value={ageRange[1] ?? ''} onChange={handleAgeMaxChange} min={ageRange[0] || 0} />
            </div>
        </>
    );
}

export default AgeFilter;