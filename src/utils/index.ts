
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

const getSearchParamsWithoutZipCodes = (searchParams: URLSearchParams) => {
    const newSearchParams = new URLSearchParams();

    [...searchParams.keys()].sort().forEach((key) => {
        if (key !== 'zipCodes') {
            searchParams
                .getAll(key)
                .sort()
                .forEach((value) => {
                    const newSortedValue = value.split(',').sort().join(',')
                    newSearchParams.append(key, newSortedValue);
                });
        }
    });

    return newSearchParams.toString();
};
const generateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const getRandomName = () => {
    const names = ["Buddy", "Bella", "Max", "Lucy", "Charlie", "Luna", "Daisy", "Milo",  "Buddy", "Bella", "Max", "Luna", "Charlie", "Lucy", "Cooper", "Bailey",
      "Daisy", "Sadie", "Milo", "Rocky", "Zoe", "Bear", "Jake", "Toby",
      "Harley", "Finn", "Sasha", "Roxy", "Zeus", "Coco", "Murphy", "Ruby",
      "Buster", "Leo", "Chloe", "Ginger", "Louie", "Pepper", "Nala", "Moose",
      "Winnie", "Maggie", "Scout", "Boomer", "Otis", "Mochi", "Koda", "Bandit",
      "Abby", "Dexter", "Riley", "Tank", "Teddy", "Goose", "Ace", "Apollo",
      "Penny", "Oliver", "Loki", "Honey", "Chewy", "Skye", "Hazel", "Benji",
      "Cash", "Indie", "Ollie", "Remy", "Simba", "Misty", "Nacho", "Waffles",
      "Shadow", "Ranger", "Poppy", "Stella", "June", "Misty", "Bruno", "Marley"];
    return names[Math.floor(Math.random() * names.length)];
  };

export { getSearchParamsWithoutZipCodes,  generateHash, getRandomName};