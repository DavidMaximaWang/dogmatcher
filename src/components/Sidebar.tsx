import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import { useDogLocationsContext } from '../context/DogsContext';
import { useDogsQuery } from '../hooks/useDogQueries';
import dog from '../services/dog';
import styles from '../styles/Sidebar.module.css';
import { Location } from '../types';
import buildDogSearchQuery from '../utils';
import SortBy from './SortBy';
import FavoriteDog from './FavoriteDog';
import AgeFilter from './AgeFilter';

interface BreedOption {
    value: string;
    label: string;
}
interface DogSearchResponse {
    resultIds: string[];
    total: number;
}

function Sidebar() {
    const { locations} = useDogLocationsContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedBreeds = searchParams.get('breeds')?.split(',') || [];

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

    const allAvailableZipCodes = Object.values(locations);

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

    return (
        <aside className={styles.aside}>
            <FavoriteDog />
            {total && <div>Total dogs found: {total}</div>}
            <SortBy />

            <div className={styles.filterSection}>
                <AgeFilter/>
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
