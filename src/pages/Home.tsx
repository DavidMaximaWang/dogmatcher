import { useEffect } from 'react';
import DogSearch from '../components/DogSearch';
import DogService from '../services/dog';

function Home() {
    useEffect(() => {
        DogService.subscribeToDogs();
      }, []);
    return (
        <DogSearch />
    );
}

export default Home;
