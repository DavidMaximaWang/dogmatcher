import { createContext, useContext } from 'react';
import { Location } from '../types';

export type DogsLocationsContextType = {
    locations: Set<Location>;
    addLocations: any;
};

export const DogsLocationContext = createContext<DogsLocationsContextType | undefined>(undefined);

export const useDogLocationsContext = () => {
    const context = useContext(DogsLocationContext);

    if (context === undefined) {
        throw new Error('No context provided');
    }

    return context;
};

