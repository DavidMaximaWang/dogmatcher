import styles from '../styles/DogSearch.module.css';
import SearchResults from './SearchResults';
import Sidebar from './Sidebar';

function DogSearch() {
    return (
        <div className={styles.container}>
            <Sidebar />
            <SearchResults />
        </div>
    );
}

export default DogSearch;
