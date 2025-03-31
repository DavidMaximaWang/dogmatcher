import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/constants';
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/config';

export async function createAxiosWithAuth(): Promise<AxiosInstance> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);

        const axiosUploadInstance = axios.create({
          baseURL: import.meta.env.VITE_DOGBREED_API_URL || "http://localhost:8000",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        resolve(axiosUploadInstance);
      } else {
        // Not logged in, fallback
        resolve(axios.create({ baseURL: import.meta.env.VITE_API_URL }));
      }
    });
  });
}


const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const axiosUploadInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

const axiosCloudinaryInstance = axios.create({
    baseURL: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`,
    headers: {
        "Content-Type": "multipart/form-data",
      },
});
export { axiosUploadInstance, axiosCloudinaryInstance };
export default axiosInstance;
