import { collection, doc, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import styles from '../styles/Uploader.module.css';
import { Dog } from '../types';

import toast from 'react-hot-toast';
import { MAX_FILES } from '../config/constants';
import { useDogContext } from '../context/DogsContext';
import UploadService from '../services/upload';
import DropZone from './DropZone';
import EditPanel from './EditPanel';
import PreviewGallery from './PreviewGallery';


const Uploader = () => {
    const authResult = useAuth();
    const { setTotal } = useDogContext();
    const [uploadedDogs, setUploadedDogs] = useState<Dog[]>([]);

    // const { isAdmin } = authResult;
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    // if (!isAdmin) {
    //     return <div>Access denied. Admin privileges required.</div>;
    // }

    async function uploadDogsInFirebase(dogs: Omit<Dog, 'id'>[]) {
        const batch = writeBatch(db);
        const dogsCollection = collection(db, 'dogs');

         const dogsTemp = dogs.map((dog) => {
            const docRef = doc(dogsCollection);
            console.log('added dog', docRef.id);
            const dogTemp = {
                ...dog,
                id: docRef.id,
                owner_id: authResult.user?.uid
            }
            batch.set(docRef, dogTemp);
            return dogTemp
        });

        await batch.commit();
        setUploadedDogs(dogsTemp);
        setTotal((prev) => (prev || 0) + dogs.length);
        console.log(`✅ Uploaded ${dogs.length} dogs`);
    }

    const handleUpload = async () => {
        if (!authResult.user?.uid) {
            return;
        }
        if (files.length === 0) {
            toast.error('Please select image(s) to upload');
            return;
        }

        if (!files.every((file) => file.type.startsWith('image/'))) {
            toast.error('All files must be images');
            return;
        }

        setUploading(true);

        try {
            const result = await UploadService.uploadAll(files);

            if (result) {
                const dogsData = UploadService.convertApiResponseToDogs(result);
                await uploadDogsInFirebase(dogsData);
            } else {
                throw new Error('Some errors happened')
            }
            toast.success('Upload successful! 🎉');
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Failed to upload image');
            toast.error('Failed to upload image')
        } finally {
            setUploading(false);
            setFiles([]);
        }
    };



    return (
        <div className={styles.container}>
            <h2> Upload dog image to detect breed(up to {MAX_FILES})</h2>
            <div className={styles.uploadSection}>
                <DropZone setFiles={setFiles} isDisabled={files.length >= MAX_FILES}/>
                <button onClick={handleUpload} disabled={!files.length || uploading} className={styles.uploadButton}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            <EditPanel dogs={uploadedDogs} setDogs={setUploadedDogs}/>
            <PreviewGallery files={files} />
        </div>
    );
};

export default Uploader;
