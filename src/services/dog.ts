import { API_LIMITS } from '../config/constants';
import { DogResult, SearchDogsParams } from '../hooks/useDogQueries';
import { Dog, Location } from '../types';
import axiosInstance from './axios';

class DogService {
    private static instance: DogService;
    private constructor() {}
    public static getInstance() {
        if (!DogService.instance) {
            DogService.instance = new DogService();
        }
        return DogService.instance;
    }

    public async getBreeds() {
        try {
            const response = await axiosInstance.get('/dogs/breeds');
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async searchDogs(params: SearchDogsParams): Promise<DogResult> {
        try {
            const queryParams = new URLSearchParams();
            if (params.size !== undefined) {
                queryParams.append('size', params.size.toString());
            }
            if (params.from !== undefined) {
                queryParams.append('from', (params.from * (params.size || 0)).toString());
            }
            if (params.sort !== undefined) {
                queryParams.append('sort', params.sort);
            }

            if (!!params.breeds && !!params.breeds[0]) {
                params.breeds.forEach((breed) => queryParams.append('breeds', breed));
            }

            if (!!params.zipCodes && !!params.zipCodes[0]) {
                if (params.zipCodes.length > API_LIMITS.MAX_ZIP_CODES) {
                    throw new Error(`Maximum of ${API_LIMITS.MAX_ZIP_CODES} ZIP codes allowed`);
                }
                params.zipCodes.forEach((zipCode) => {
                    queryParams.append('zipCodes', zipCode);
                });
            }

            if (params.ageMin !== undefined) {
                queryParams.append('ageMin', params.ageMin.toString());
            }

            if (params.ageMax !== undefined) {
                queryParams.append('ageMax', params.ageMax.toString());
            }

            const queryString = queryParams.toString();
            const response = await axiosInstance.get(`/dogs/search${queryString ? `?${queryString}` : ''}`);

            return response.data;
        } catch (error) {
            console.error('Error searching dogs:', error);
            throw error;
        }
    }

    public async getDogs(dogIds: string[]): Promise<Dog[]> {
        try {
            const response = await axiosInstance.post('/dogs', dogIds);
            return response.data;
        } catch (error) {
            console.error('Error fetching dogs:', error);
            throw error;
        }
    }

    public async getDogLocations(zipCodes: string[]): Promise<Location[]> {
        try {
            const response = await axiosInstance.post('/locations', zipCodes);
            return response.data;
        } catch (error) {
            console.error('Error fetching dogs:', error);
            throw error;
        }
    }
}

export default DogService.getInstance();
