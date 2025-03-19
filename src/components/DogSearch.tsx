import DogsContextProvider from '../context/DogsContextProvider';
import SearchResults from './SearchResults';
import Sidebar from './Sidebar';

function DogSearch() {
    return (
        <DogsContextProvider>
            <Sidebar />
            <SearchResults />
        </DogsContextProvider>
    );
}

export default DogSearch;
