import { deleteImageByToken, createAxiosWithAuth } from './axios';
import { axiosCloudinaryInstance } from './axios';
import { Dog } from '../types';
import { getRandomName } from '../utils';

class UploadService {
    private static instance: UploadService;

    constructor() {}
    public static getInstance() {
        if (!UploadService.instance) {
            UploadService.instance = new UploadService();
        }
        return UploadService.instance;
    }

    private uploadMultipleBreedDetection = async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        const axiosUploadInstance = await createAxiosWithAuth()
        const response = await axiosUploadInstance.post('/predicts', formData);
        return response.data;
    };

    private batchUploadToCloudinary = async (files: File[], batchSize = 5) => {
        const result = [];

        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            const urls = await Promise.all(batch.map((file) => this.uploadToCloudinary(file)));
            result.push(...urls);
        }

        return result;
    };

    private  deleteImageFromCloudinary = async (delete_token: string) =>{
        try {
            const res = await deleteImageByToken(delete_token);
            return res;
        } catch (err: any) {
            console.error('Error deleting image:', err.response?.data || err.message);
            throw err;
        }
      }
    //temp public
    public batchDeleteImageFromCloudinary = async (cloudinaryUrls: { url: string; public_id: string, delete_token: string }[]) => {
        for (const { delete_token } of cloudinaryUrls) {
            await this.deleteImageFromCloudinary(delete_token);
        }
    };

    private uploadToCloudinary = async (file: File): Promise<{ url: string; public_id: string }> => {

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            // formData.append('return_delete_token', 'true');
            // data.append('public_id',); // optional

            const response = await axiosCloudinaryInstance.post('/image/upload', formData);

            const { secure_url, public_id } = response.data;

            return { url: secure_url, public_id };
        } catch (error) {
            console.error('❌ Upload failed:', error);
            throw error;
        }
    };

    public uploadAll = async (files: File[]) => {
        const breedDetectionPromise = this.uploadMultipleBreedDetection(files);
        const cloudinaryPromises = this.batchUploadToCloudinary(files);
        try {
            const [breedPredictions, cloudinaryUrls] = await Promise.all([breedDetectionPromise, cloudinaryPromises]);
            if (breedPredictions.predictions.length !== cloudinaryUrls.length) {
                //    await this.batchDeleteImageFromCloudinary(cloudinaryUrls);
                throw new Error("Won't handle it");
            }
            return {
                predictions: breedPredictions,
                imageUrls: cloudinaryUrls
            };
        } catch (e) {
            console.error(e);
        }

    };

    public convertApiResponseToDogs =  (response: {predictions: any, imageUrls: {
        url: string;
        public_id: string;
    }[]}): Omit<Dog, 'id'>[] => {
        const { predictions, imageUrls } = response;

        const dogDataArray: Omit<Dog, 'id'>[] = predictions.predictions.map((predictionGroup: [string, number][], index: number) => {
          const topBreed = predictionGroup[0][0]; // Top-1 prediction
          const confidence = predictionGroup[0][1]; // Top-1 prediction
          const img = imageUrls[index]?.url || '';
          const name = getRandomName();

          return {
            name,
            age: Math.floor(Math.random() * 15) + 1,
            breed: topBreed,
            zip_code: (Math.floor(Math.random() * 90000) + 10000).toString(),
            img,
            confidence,
          };
        });

        return dogDataArray;
      };
}

export default UploadService.getInstance();
