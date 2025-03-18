import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import { useDogsQuery, useDogsQueryWithDetails } from '../hooks/useDogQueries';
import dog from '../services/dog';
import { Location } from '../types';
import buildDogSearchQuery from '../utils';
import styles from './Sidebar.module.css';
import SortBy from './SortBy';

interface BreedOption {
    value: string;
    label: string;
}
interface DogSearchResponse {
    resultIds: string[];
    total: number;
}

function Sidebar() {
    // return <div>bbb</div>
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedBreeds = searchParams.get('breeds')?.split(',') || [];
    const ageMin = searchParams.get('ageMin') ? parseInt(searchParams.get('ageMin')!) : undefined;
    const ageMax = searchParams.get('ageMax') ? parseInt(searchParams.get('ageMax')!) : undefined;

    const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [breeds, setBreeds] = useState<string[]>([]);
    const dogSearchQuery = buildDogSearchQuery(searchParams);
    const dogSearchResult = useDogsQuery(dogSearchQuery);

    const searchData = dogSearchResult?.data as unknown as DogSearchResponse;

    const total = searchData?.total;

    const breedOptions = breeds.map((breed) => ({
        value: breed,
        label: breed
    }));

    const handleBreedChange = (
        selectedOptions: MultiValue<BreedOption>,
    ) => {
        const breeds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
        if (breeds.length > 0) {
            searchParams.set('breeds', breeds.join(','));
        } else {
            searchParams.delete('breeds');
        }
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {zipCodes, ...rest} = dogSearchQuery;

    const dogsResultsWithDetails = useDogsQueryWithDetails({...rest, zipCodes: []})
    const locationsData1 = dogsResultsWithDetails.data.locationsData;
    const allAvailableZipCodes = Object.values(locationsData1);

    const selectedLocations = allAvailableZipCodes.filter((location) => selectedZipCodes.includes(location.zip_code));

    const handleLocationChange = (
        selectedOptions: MultiValue<Location>,
    ) => {
        const chosenZipCodes = selectedOptions ? selectedOptions.map((opt) => opt.zip_code) : [];
        setSelectedZipCodes(chosenZipCodes);
        const removedZipCodes = selectedZipCodes.filter((zip) => !chosenZipCodes.includes(zip));

        if (!isMenuOpen && removedZipCodes.length > 0) {
            const filteredLocations = selectedLocations.filter((location) => !removedZipCodes.includes(location.zip_code));
            const zipCodes = filteredLocations.map((option) => option.zip_code);
            if (zipCodes.length > 0) {
                searchParams.set('zipCodes', zipCodes.join(','));
            } else {
                searchParams.delete('zipCodes');
            }
            setSearchParams(searchParams);
        }
    };

    const handleLocationMenuOpen = () => {
        setIsMenuOpen(true);
    };

    const handleLocationMenuClose = () => {
        const zipCodes = selectedLocations ? selectedLocations.map((option) => option.zip_code) : [];
        if (zipCodes.length > 0) {
            searchParams.set('zipCodes', zipCodes.join(','));
        } else {
            searchParams.delete('zipCodes');
        }
        setSearchParams(searchParams);
        setIsMenuOpen(false);
    };

    const handleAgeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        if (value !== undefined) {
            searchParams.set('ageMin', value.toString());
        } else {
            searchParams.delete('ageMin');
        }
        setSearchParams(searchParams);
    };

    const handleAgeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        if (value !== undefined) {
            searchParams.set('ageMax', value.toString());
        } else {
            searchParams.delete('ageMax');
        }
        setSearchParams(searchParams);
    };

    return (
        <aside className={styles.aside}>
            {total && <div>Total dogs found: {total}</div>}
            <SortBy />

            <div className={styles.filterSection}>
                <label>Age Range:</label>
                <div className={styles.ageInputs}>
                    <input
                        type="number"
                        placeholder="Min Age"
                        value={ageMin || ''}
                        onChange={handleAgeMinChange}
                    />
                    <input
                        type="number"
                        placeholder="Max Age"
                        value={ageMax || ''}
                        onChange={handleAgeMaxChange}
                    />
                </div>
            </div>

            <Select
                isMulti
                options={breedOptions}
                onChange={handleBreedChange}
                value={breedOptions.filter((option) => selectedBreeds.includes(option.value))}
                placeholder="Select breeds..."
                className="breed-select"
            />

            <Select
                isMulti
                options={allAvailableZipCodes}
                value={selectedLocations}
                onChange={handleLocationChange}
                getOptionLabel={(option) => `${option.city} (${option.zip_code})`}
                getOptionValue={(option) => option.zip_code}
                placeholder="Select a location..."
                isClearable
                isSearchable
                onMenuOpen={handleLocationMenuOpen}
                onMenuClose={handleLocationMenuClose}
                closeMenuOnSelect={false}
            />
        </aside>
    );
}

export default Sidebar;
