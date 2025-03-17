import { Dog } from "../types";
import axiosInstance from "./axios";

class DogService {
    private static instance: DogService;
    private constructor() {}
    public static getInstance() {
        if (!DogService.instance) { DogService.instance = new DogService(); }
        return DogService.instance;
    }

    public async getBreeds(){

        try{
            const response = await axiosInstance.get('/dogs/breeds');
            return response.data;
        }catch(error){
            console.error(error);
            throw error;
        }

    }
    public async searchDogs(params: {
        page: number;
        size: number;
        sort: string;
        breeds: string[];
      }): Promise<string[]> {
        try {
          const queryParams = new URLSearchParams();
          queryParams.append("size", params.size.toString());
          queryParams.append("from", (params.page * params.size).toString());
          queryParams.append("sort", params.sort);

          if (params.breeds.length > 0) {
            params.breeds.forEach((breed) =>
              queryParams.append("breeds", breed)
            );
          }

          const response = await axiosInstance.get(
            `/dogs/search?${queryParams.toString()}`
          );

          return response.data;
        } catch (error) {
          console.error("Error searching dogs:", error);
          throw error;
        }
      }

      public async getDogs(dogIds: string[]): Promise<Dog[]> {
        try {
          const response = await axiosInstance.post('/dogs', dogIds);
          return response.data;
        } catch (error) {
          console.error("Error fetching dogs:", error);
          throw error;
        }
      }

      public async getDogLocations(zipCodes: string[]): Promise<Location[]> {
        try {
          const response = await axiosInstance.post('/locations', zipCodes);
          return response.data;
        } catch (error) {
          console.error("Error fetching dogs:", error);
          throw error;
        }
      }

}

export default DogService.getInstance();