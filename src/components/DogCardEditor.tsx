import { useState } from 'react';
import { Dog } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';
import styles from '../styles/DogCardEditor.module.css';

interface Props {
    dog: Dog;
    setDogs?: React.Dispatch<React.SetStateAction<Dog[]>>;
}

export default function DogCardEditor({ dog, setDogs }: Props) {
    const [form, setForm] = useState({ ...dog });

    const handleChange = (key: keyof Dog, value: string | number) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            const docRef = doc(db, 'dogs', dog.id);
            const cc = {
                name: form.name,
                age: form.age,
                breed: form.breed,
                zip_code: form.zip_code
            };
            await updateDoc(docRef, cc);
            if (setDogs) {
                setDogs((prev) =>
                    prev.map((d) => {
                        if (d.id !== dog.id) {
                            return d;
                        } else {
                            return { ...d, ...cc };
                        }
                    })
                );
            }
            toast.success(`Dog info updated! (${dog.id})`);
        } catch (err) {
            console.error('Error updating dog:', err);
            toast.error('Failed to update dog info');
        }
    };

    return (
        <div className={styles.card}>
            <img src={form.img} alt={form.breed} className={styles.image} />

            <div className={styles.row}>
                <label className={styles.label}>Name:</label>
                <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={styles.input} />
            </div>

            <div className={styles.row}>
                <label className={styles.label}>Age:</label>
                <input type="number" value={form.age} onChange={(e) => handleChange('age', Number(e.target.value))} className={styles.input} />
            </div>

            <div className={styles.row}>
                <label className={styles.label}>Breed:</label>
                <input type="text" value={form.breed} onChange={(e) => handleChange('breed', e.target.value)} className={styles.input} />
            </div>

            <div className={styles.row}>
                <label className={styles.label}>Zip Code:</label>
                <input type="text" value={form.zip_code} onChange={(e) => handleChange('zip_code', e.target.value)} className={styles.input} />
            </div>

            <div style={{ marginBottom: 12 }}>
                <strong>Confidence:</strong> {form.confidence ? `${(form.confidence * 100).toFixed(2)}%` : 'N/A'}
            </div>

            <button onClick={handleSave} className={styles.button}>
                Save
            </button>
        </div>
    );
}
