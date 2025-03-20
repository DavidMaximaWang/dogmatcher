import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import { useDogContext } from '../context/DogsContext';
import { Location } from '../types';

function LocationFilter() {

    const { locations} = useDogContext();
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    />);
}

export default LocationFilter