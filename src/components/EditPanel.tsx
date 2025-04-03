import { Dog } from '../types';
import DogCardEditor from './DogCardEditor';

function EditPanel({ dogs, setDogs }: { dogs: Dog[], setDogs?: React.Dispatch<React.SetStateAction<Dog[]>> }) {
    return (
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', }}>
            {dogs.map((dog) => (
                <DogCardEditor key={dog.id} dog={dog} setDogs={setDogs}/>
            ))}
        </div>
    );
}

export default EditPanel;
