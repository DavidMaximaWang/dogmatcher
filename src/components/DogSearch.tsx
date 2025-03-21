import SearchResults from './SearchResults';
import Sidebar from './Sidebar';
import styles from '../styles/DogSearch.module.css';

function DogSearch() {
    return (
        <div className={styles.container}>
            <Sidebar />
            <SearchResults />
        </div>
    );
}

export default DogSearch;