import React, { useEffect } from 'react'
import dog from '../services/dog';

function DogSearch() {
    const [breeds, setBreeds] = React.useState<string[]>([]);
    useEffect(() => {
        const fetchBreeds = async () => {

            try{

            const breedsFetched = await dog.getBreeds();
                setBreeds(breedsFetched);
            } catch(error){
                console.error(error);
            }
          }

        fetchBreeds();
    }, []);
  return (
    <div>
        {
            breeds.map((breed) => {
                return <div key={breed}>{breed}</div>
            })
        }
    </div>
  )
}

export default DogSearch