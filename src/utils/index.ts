
import { DEFAULT_PARAMS } from "../config/constants";

const buildDogSearchQuery = (searchParams: URLSearchParams) => {
    const queryParameters = Object.fromEntries(searchParams.entries());
    const queryParams = {
        from: Number(queryParameters.from) || DEFAULT_PARAMS.from,
        size: Number(queryParameters.size) || DEFAULT_PARAMS.size,
        sort: queryParameters.sort || 'breed:asc',
        breeds: queryParameters.breeds ? queryParameters.breeds.split(',') : [],
        zipCodes: queryParameters.zipCodes ? queryParameters.zipCodes.split(',') : [],
        ageMin: queryParameters.ageMin ? Number(queryParameters.ageMin) : undefined,
        ageMax: queryParameters.ageMax ? Number(queryParameters.ageMax) : undefined
    };


    return queryParams;
}

export default buildDogSearchQuery;