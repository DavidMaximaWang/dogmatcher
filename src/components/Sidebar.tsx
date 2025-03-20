import { useDogContext } from '../context/DogsContext';
import styles from '../styles/Sidebar.module.css';
import AgeFilter from './AgeFilter';
import BreedFilter from './BreedFilter';
import FavoriteDog from './FavoriteDog';
import LocationFilter from './LocationFilter';
import SortBy from './SortBy';

function Sidebar() {
    const {total} = useDogContext()
    return (
        <aside className={styles.aside}>
            <FavoriteDog />
            {total && <div>Total dogs found: {total}</div>}
            <SortBy />
            <div className={styles.filterSection}>
                <AgeFilter />
            </div>
            <BreedFilter />
            <LocationFilter />
        </aside>
    );
}

export default Sidebar;
