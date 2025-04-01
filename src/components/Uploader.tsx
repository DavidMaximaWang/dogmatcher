import { collection, doc, writeBatch } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import styles from '../styles/Uploader.module.css';
import { Dog } from '../types';

import UploadService from '../services/upload';
import { useDogContext } from '../context/DogsContext';
import DropZone from './DropZone';
import PreviewGallery from './PreviewGallery';
import { MAX_FILES } from '../config/constants';


const Uploader = () => {
    const authResult = useAuth();
    const { setTotal } = useDogContext();

    // const { isAdmin } = authResult;
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // if (!isAdmin) {
    //     return <div>Access denied. Admin privileges required.</div>;
    // }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const selectedFiles = Array.from(e.target.files);
          setFiles((prev) => [...prev, ...selectedFiles].slice(0, MAX_FILES));
        }
      };
      const  handleDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles].slice(0, MAX_FILES));
        }, []);
    async function uploadDogsInFirebase(dogs: Omit<Dog, 'id'>[]) {
        const batch = writeBatch(db);
        const dogsCollection = collection(db, 'dogs');

        dogs.forEach((dog) => {
            const docRef = doc(dogsCollection);
            console.log('added dog', docRef.id);
            batch.set(docRef, {
                ...dog,
                id: docRef.id,
                owner_id: authResult.user?.uid
            });
        });

        await batch.commit();
        setTotal((prev) => (prev || 0) + dogs.length);
        console.log(`✅ Uploaded ${dogs.length} dogs`);
    }

    const handleUpload = async () => {
        if (!authResult.user?.uid) {
            return;
        }
        if (files.length === 0) {
            setError('Please select image(s) to upload');
            return;
        }

        if (!files.every((file) => file.type.startsWith('image/'))) {
            setError('All files must be images');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await UploadService.uploadAll(files);
            console.log('result', result);
            const dogsData = UploadService.convertApiResponseToDogs(result);
            await uploadDogsInFirebase(dogsData);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };



    return (
        <div className={styles.container}>
            <h2> Upload dog image to detect breed(up to {MAX_FILES})</h2>
            <div className={styles.uploadSection}>
                <DropZone handleFileChange={handleFileChange} handleDrop={handleDrop} isDisabled={files.length >= MAX_FILES}/>
                <button onClick={handleUpload} disabled={!files.length || uploading} className={styles.uploadButton}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>Upload successful!</p>}
            </div>
            <PreviewGallery files={files} />
        </div>
    );
};

export default Uploader;
