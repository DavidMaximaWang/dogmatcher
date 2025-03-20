import { useQuery, UseQueryResult, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import DogService from '../services/dog';
import { Dog, Location, Match } from '../types';
import { useMemo } from 'react';

export interface SearchDogsParams {
    from?: number;
    size?: number;
    sort?: string;
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
}
export interface DogResult {
    next?: string;
    resultIds: string[];
    total: number;
}

export const useDogsInfiniteQuery = ({ from, size, sort, breeds, zipCodes, ageMax, ageMin }: SearchDogsParams) => {
    console.log('frommmm:,' , from)
    console.trace();
    return useInfiniteQuery({
        queryKey: ['dogs', size, sort, breeds, zipCodes, ageMin, ageMax],
        queryFn: async ({ pageParam = 0 }) => {
            try{
            const result = await DogService.searchDogs({
                from: pageParam,
                size: size || 20,
                sort,
                breeds,
                zipCodes,
                ageMax,
                ageMin
            });
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }

        },
        getNextPageParam: (lastPage: DogResult) => {
            if (lastPage?.next) {
                const params = new URLSearchParams(lastPage.next.split('?')[1]);
                return params.get('from') ? Number(params.get('from')) : undefined
            }
            return undefined;
        },
        initialPageParam: from ? Number(from) : 0,
        retry: 2
    });
};

export const useDogsQuery = ({ from, size, sort, breeds, zipCodes, ageMax, ageMin }: SearchDogsParams): UseQueryResult<DogResult> => {
    return useQuery({
        queryKey: ['dogs', from, size, sort, breeds, zipCodes, ageMin, ageMax],
        queryFn: () =>
            DogService.searchDogs({
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

export const useMatchDogs = () => {
    return useMutation<Match, Error, string[]>({
        mutationFn: (favoriteIds) => DogService.getMatch(favoriteIds)
    });
};

export const useDogDetails = (dogIds: string[] | undefined) => {
    const result = useQuery<Dog[]>({
        queryKey: ['dogDetails', dogIds],
        queryFn: () => DogService.getDogs(dogIds || []),
        enabled: !!dogIds && dogIds.length > 0,
        retry: 2
    });
    const zipCodes = result.data?.map((dog) => dog.zip_code) || [];
    return { ...result, zipCodes };
};

export const useDogLocations = (zipCodes: string[] | undefined) => {
    const result = useQuery<Location[]>({
            queryKey: ['dogLocations', zipCodes],
            queryFn: () => DogService.getDogLocations(zipCodes || []),
            enabled: !!zipCodes && zipCodes.length > 0,
            retry: 2
        });
    if (zipCodes && zipCodes.length > 0) {
        const locations = zipCodes.reduce((acc, zipCode) => {
            const location = result.data?.find((loc) => loc?.zip_code === zipCode);
            if (location) {
                acc[zipCode] = location;
            }
            return acc;
        }, {} as Record<string, Location>);

        return {locations, isLoading: result.isLoading}
    }
    return {locations: {}, isLoading: result.isLoading};
};


export const useDogsQueryWithDetails = (query: SearchDogsParams) => {
    const { data: result, isLoading: isDogsLoading } = useDogsQuery(query);

    const resultIds = useMemo(() => result?.resultIds || [], [result?.resultIds]);

    const { data: dogDetailsArray = [], zipCodes = [] } = useDogDetails(resultIds);

    const {isLoading: isLocationsLoading, locations: locationsData = {}} = useDogLocations(zipCodes);

    const data = useMemo(
        () => ({
            dogsResult: result,
            resultIds,
            dogDetailsArray,
            zipCodes,
            locationsData
        }),
        [result, resultIds, dogDetailsArray, zipCodes, locationsData]
    );

    const isLoading = isDogsLoading || isLocationsLoading;

    return { data, isLoading };
};


export const useDogsQueryWithDetailsByIds = (resultIds: string[]) => {

    const { data: dogDetailsArray = [], zipCodes = [] } = useDogDetails(resultIds);

    const {isLoading: isLocationsLoading, locations: locationsData = {}} = useDogLocations(zipCodes);

    const data = useMemo(
        () => ({
            resultIds,
            dogDetailsArray,
            zipCodes,
            locationsData
        }),
        [resultIds, dogDetailsArray, zipCodes, locationsData]
    );

    const isLoading = isLocationsLoading;

    return { data, isLoading };
};

export const useDogsInfiniteQuery1 = ({ from, size, sort, breeds, ageMax, ageMin }: Omit<SearchDogsParams, 'zipCodes'>) => {
    return useInfiniteQuery({
        queryKey: ['dogs', size, sort, breeds, ageMin, ageMax],
        queryFn: async ({ pageParam = 0 }) => {
            const result = await DogService.searchDogs({
                from: pageParam,
                size: size || 20,
                sort,
                breeds,
                ageMax,
                ageMin
            });
            return result;
        },
        getNextPageParam: (lastPage: DogResult) => {
            if (lastPage?.next) {
                const params = new URLSearchParams(lastPage.next.split('?')[1]);
                return params.get('from') ? Number(params.get('from')) : undefined;
            }
            return undefined;
        },
        initialPageParam: from ?? 0,
        retry: 2
    });
};

export const useAvailableLocationsQuery = (allParams: Omit<SearchDogsParams, 'zipCodes'>) => {
    const { data: pageData, isLoading: isDogsLoading } = useDogsInfiniteQuery1(allParams);

    const resultIds = useMemo(() => {
        return (pageData && pageData.pages && pageData.pages.map((page) => page.resultIds)) || [];
    }, [pageData]);
    const aa = resultIds.slice(-1)?.[0] || [];
    const { zipCodes = [] } = useDogDetails(aa);

    const { isLoading: isLocationsLoading, locations: locationsData = {} } = useDogLocations(zipCodes);

    const data = useMemo(
        () => ({
            zipCodes,
            locationsData
        }),
        [zipCodes, locationsData]
    );

    const isLoading = isDogsLoading || isLocationsLoading;

    return { data, isLoading };
}