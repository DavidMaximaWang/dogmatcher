import { createContext, SetStateAction, useContext } from 'react';
import { Location } from '../types';

export type DogsLocationsContextType = {
    locations: Record<string, Location>;
    addLocations: (newlocations: Record<string, Location>) => void;
    initAddLocations: (newlocations: Record<string, Location>) => void;
    selectedDogIds: string[];
    toggleSelectDog: (id: string) => void;
    total: number | undefined;
    setTotal: React.Dispatch<React.SetStateAction<number | undefined>>;
    searchResultLoaded?: boolean;
    setSearchResultLoadedCallback: React.Dispatch<SetStateAction<boolean | undefined>>;
};

export const DogsContext = createContext<DogsLocationsContextType | undefined>(undefined);

export const useDogContext = () => {
    const context = useContext(DogsContext);

    if (context === undefined) {
        throw new Error('No context provided');
    }

    return context;
};
