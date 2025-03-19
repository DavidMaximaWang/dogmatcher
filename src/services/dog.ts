import { API_CONFIG, API_LIMITS } from '../config/constants';
import { DogResult, SearchDogsParams } from '../hooks/useDogQueries';
import { Dog, Location, Match } from '../types';
import axiosInstance from './axios';

const {DOGS_SEARCH, DOGS, BREEDS, LOCATIONS, DOG_MATCH} = API_CONFIG.ENDPOINTS

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
            const response = await axiosInstance.get(BREEDS);
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
                queryParams.append('from', params.from.toString());
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
            const response = await axiosInstance.get(`${DOGS_SEARCH}${queryString ? `?${queryString}` : ''}`);

            return response.data;
        } catch (error) {
            console.error('Error searching dogs:', error);
            throw error;
        }
    }

    public async getDogs(dogIds: string[]): Promise<Dog[]> {
        try {
            if (dogIds.length === 0) {
                return [];
            }
            const response = await axiosInstance.post(DOGS, dogIds);
            return response.data;
        } catch (error) {
            console.error('Error fetching dogs:', error);
            throw error;
        }
    }


    public async getMatch(favoriteIds: string[]): Promise<Match> {
        try {
            const response = await axiosInstance.post(DOG_MATCH, favoriteIds);
            return response.data;
        } catch (error) {
            console.error('Failed to get match:', error);
            throw error;
        }
    }

    public async getDogLocations(zipCodes: string[]): Promise<Location[]> {
        try {
            const response = await axiosInstance.post(LOCATIONS, zipCodes);
            return response.data;
        } catch (error) {
            console.error('Error fetching dogs:', error);
            throw error;
        }
    }
}

export default DogService.getInstance();
