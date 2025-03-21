import { useInfiniteQuery, UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import DogService from '../services/dog';
import { Dog, Location, Match } from '../types';

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
    const fetchDogs = useCallback(
        async ({ pageParam = 0 }: { pageParam: number }) => {
            try {
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
                if (process.env.NODE_ENV === 'development') {
                    console.error('Failed to fetch dogs:', error);
                }
                throw error;
            }
        },
        [size, sort, breeds, zipCodes, ageMax, ageMin]
    );
    const queryKey = useMemo(() => ['dogs', size, sort, breeds, zipCodes, ageMin, ageMax], [size, sort, breeds, zipCodes, ageMin, ageMax]);
    return useInfiniteQuery({
        queryKey,
        queryFn: fetchDogs,
        getNextPageParam: (lastPage: DogResult) => {
            if (lastPage?.next) {
                const params = new URLSearchParams(lastPage.next.split('?')[1]);
                return params.get('from') ? Number(params.get('from')) : undefined;
            }
            return undefined;
        },
        initialPageParam: from ? Number(from) : 0,
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
    const locations = useMemo(() => {
        return (
            zipCodes?.reduce((acc, zipCode) => {
                const location = result.data?.find((loc) => loc?.zip_code === zipCode);
                if (location) acc[zipCode] = location;
                return acc;
            }, {} as Record<string, Location>) || {}
        );
    }, [zipCodes, result.data]);
    return { locations, isLoading: result.isLoading };
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

export const useDogsQueryWithDetails = (query: SearchDogsParams) => {
    const { data: result, isLoading: isDogsLoading } = useDogsQuery(query);

    const resultIds = useMemo(() => result?.resultIds || [], [result?.resultIds]);

    const { data: dogDetailsArray = [], zipCodes = [] } = useDogDetails(resultIds);

    const { isLoading: isLocationsLoading, locations: locationsData = {} } = useDogLocations(zipCodes);

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

    const { isLoading: isLocationsLoading, locations: locationsData = {} } = useDogLocations(zipCodes);

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
