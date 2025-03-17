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

}

export default DogService.getInstance();