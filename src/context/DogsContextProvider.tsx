import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import styles from '../styles/DogsContexProvider.module.css';
import { DogsContext } from './DogsContext';
import { Location } from '../types';

import { isEqual } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import { getSearchParamsWithoutZipCodes } from '../utils';

type Props = { children: ReactNode };

export default function DogsContextProvider({ children }: Props) {
    const [locations, setLocations] = useState<Record<string, Location>>({});
    const [total, setTotal] = useState<number|undefined>(undefined);
    const [searchParams] = useSearchParams();
    const searchParamString = getSearchParamsWithoutZipCodes(searchParams);
    const prevSearchParamString = useRef<string>(searchParamString);
    const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);

    const addLocations = useCallback(
        (newLocations: Record<string, Location>) => {
            const keys1 = Object.keys(locations);
            const keys2 = Object.keys({ ...locations, ...newLocations });

            const areKeysEqual = isEqual([...keys1].sort(), [...keys2].sort());
            if (!areKeysEqual) {
                setLocations((prevLocations) => ({ ...prevLocations, ...newLocations }));
            }
        },
        [locations]
    );

    const initAddLocations = useCallback(
        (newLocations: Record<string, Location>) => {
            if (Object.keys(locations).length && prevSearchParamString.current === searchParamString) {
                return;
            }
            const keys1 = Object.keys(locations);
            const keys2 = Object.keys(newLocations);

            const areKeysEqual = isEqual([...keys1].sort(), [...keys2].sort());

            if (!areKeysEqual) {
                setLocations((prevLocations) => ({ ...prevLocations, ...newLocations }));
            }
            prevSearchParamString.current = searchParamString;
        },
        [locations, searchParamString]
    );
    const toggleSelectDog = useCallback((id: string) => {
        setSelectedDogIds((prev) => (prev.includes(id) ? prev.filter((dogId) => dogId !== id) : [...prev, id]));
    }, []);

      const value = useMemo(
        () => ({
          locations,
          addLocations,
          initAddLocations,
          selectedDogIds,
          toggleSelectDog,
          total,
          setTotal
        }),
        [locations, addLocations, initAddLocations, selectedDogIds, toggleSelectDog, total, setTotal]
      );

    // const context = { locations, addLocations };

    return (
        <div className={styles.container}>
            <DogsContext.Provider value={value}>{children}</DogsContext.Provider>;
        </div>
    );
}
