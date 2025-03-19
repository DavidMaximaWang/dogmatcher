import { ReactNode, useMemo, useState } from 'react';
import styles from '../styles/DogsLocationProvider.module.css';
import { DogsLocationContext } from './DogsLocationContext';
import { Location } from '../types';

type Props = { children: ReactNode };

export default function DogsLocationContextProvider({ children }: Props) {
    const [locations, setLocations] = useState<Set<Location>>(new Set());

    const addLocations = (newLocations: Location[]) => {
        setLocations((prevLocations) => {
          const updatedLocations = new Set(prevLocations);
          newLocations.forEach((location) => {
            updatedLocations.add(location);
          });
          return updatedLocations;
        });
      };

      const value = useMemo(
        () => ({
          locations,
          addLocations,
        }),
        [locations]
      );

    // const context = { locations, addLocations };

    return (
        <div className={styles.container}>
            <DogsLocationContext.Provider value={value}>{children}</DogsLocationContext.Provider>;
        </div>
    );
}
