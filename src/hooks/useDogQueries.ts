import { useQuery, UseQueryResult } from '@tanstack/react-query';
import DogService from '../services/dog';
import { Dog, Location } from '../types';

interface SearchDogsParams {
    from: number;
    size: number;
    sort: string;
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDogs = ({ from, size, sort, breeds, zipCodes, ageMax, ageMin }: SearchDogsParams): UseQueryResult<any[]> => {
    return useQuery({
        queryKey: ['dogs', from, size, sort, breeds, zipCodes, ageMin, ageMax],
        queryFn: () => DogService.searchDogs({
            from,
            size,
            sort,
            breeds: breeds || [],
            zipCodes: zipCodes || [],
            ageMax,
            ageMin
        }),
        retry: 2
    });
};

export const useDogDetails = (dogIds: string[] | undefined) => {
    const result = useQuery<Dog[]>({
        queryKey: ['dogDetails', dogIds], // Cache key
        queryFn: () => DogService.getDogs(dogIds || []),
        enabled: !!dogIds && dogIds.length > 0,
        retry: 2
    });
    const zipCodes = result.data?.map((dog) => dog.zip_code) || [];
    return { ...result, zipCodes };
};

export const useDogLocations = (zipCodes: string[] | undefined) => {
    const result = useQuery<Location[]>({ queryKey: ['dogLocations', zipCodes], queryFn: () => DogService.getDogLocations(zipCodes || []), enabled: !!zipCodes && zipCodes.length > 0, retry: 2 });
    if (zipCodes && zipCodes.length > 0) {
        return zipCodes.reduce((acc, zipCode) => {
            const location = result.data?.find((loc) => loc?.zip_code === zipCode);
            if (location) {
                acc[zipCode] = location;
            }
            return acc;
        }, {} as Record<string, Location>);
    }
    return {};
};
