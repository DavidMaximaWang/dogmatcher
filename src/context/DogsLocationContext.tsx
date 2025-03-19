import { createContext, useContext } from 'react';
import { Location } from '../types';

export type DogsLocationsContextType = {
    locations: Record<string, Location>;
    addLocations: (newlocations: Record<string, Location>) => void;
    initAddLocations: (newlocations: Record<string, Location>) => void;
};

export const DogsLocationContext = createContext<DogsLocationsContextType | undefined>(undefined);

export const useDogLocationsContext = () => {
    const context = useContext(DogsLocationContext);

    if (context === undefined) {
        throw new Error('No context provided');
    }

    return context;
};

