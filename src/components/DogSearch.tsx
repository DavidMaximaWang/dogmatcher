import DogsLocationContextProvider from '../context/DogsLocationContextProvider';
import SearchResults from './SearchResults';
import Sidebar from './Sidebar';

function DogSearch() {
    return (
        <DogsLocationContextProvider>
            <Sidebar />
            <SearchResults />
        </DogsLocationContextProvider>
    );
}

export default DogSearch;
