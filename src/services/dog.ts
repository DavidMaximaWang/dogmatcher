import { collection, documentId, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { DogResult, SearchDogsParams } from '../hooks/useDogQueries';
import { Dog, Location, Match } from '../types';

class DogService {
    private static instance: DogService;
    private constructor() {}
    public static getInstance() {
        if (!DogService.instance) {
            DogService.instance = new DogService();
        }
        return DogService.instance;
    }
    private allDogs: Dog[] = [];
    private hasLoaded = false;

    private async loadDogsIfNeeded() {
        if (!this.hasLoaded) {
            const snapshot = await getDocs(collection(db, 'dogs'));
            this.allDogs = snapshot.docs.map((doc) => doc.data() as Dog);
            console.log(this.allDogs);
            this.hasLoaded = true;
        }
    }
    private dogsForOwner = new Map<string, any>();

    private async getDocsWithOwner(owner_id: string) {
        if (!this.dogsForOwner.get(owner_id)) {
            const q = query(collection(db, 'dogs'), where('owner_id', '==', owner_id));
            const snapshot = await getDocs(q);

            const dogs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })).slice(0, 4);
            this.dogsForOwner.set(owner_id, dogs)
            return dogs;
        }
        return this.dogsForOwner.get(owner_id)
    }

    public subscribeToDogs(callback?: () => void) {
        const dogsRef = collection(db, 'dogs');

        onSnapshot(dogsRef, (snapshot) => {
            this.allDogs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Dog[];
            if (callback) callback();
        });
    }

    public async getAllDogs(uid?: string): Promise<Dog[]> {
        if (uid) {
              await this.getDocsWithOwner(uid)
              return this.dogsForOwner.get(uid)
        }
        await this.loadDogsIfNeeded();
        return this.allDogs;
    }
    public async getBreeds(): Promise<string[]> {
        const snapshot = await getDocs(collection(db, 'dogs'));
        const breedsSet = new Set<string>();
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.breed) breedsSet.add(data.breed);
        });
        return Array.from(breedsSet);
    }

    public async searchDogs(params: SearchDogsParams, uid?: string): Promise<DogResult> {
        let dogs = await this.getAllDogs(uid);

        // Filter
        if (params.breeds?.length) {
            dogs = dogs.filter((d) => params.breeds!.includes(d.breed));
        }
        if (params.zipCodes?.length) {
            dogs = dogs.filter((d) => params.zipCodes!.includes(d.zip_code));
        }
        if (params.ageMin !== undefined) {
            dogs = dogs.filter((d) => (params.ageMin ? d.age >= params.ageMin : true));
        }
        if (params.ageMax !== undefined) {
            dogs = dogs.filter((d) => (params.ageMax ? d.age <= params.ageMax : true));
        }

        // Sort
        if (params.sort) {
            const [field, direction] = params.sort.split(':');
            dogs.sort((a, b) => {
                const valA = a[field as keyof Dog];
                const valB = b[field as keyof Dog];
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return direction === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
                }
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return direction === 'desc' ? valB - valA : valA - valB;
                }
                return 0;
            });
        }

        // Pagination
        const total = dogs.length;
        const from = params.from || 0;
        const size = params.size || 24;
        const paged = dogs.slice(from, from + size);

        // Build query string for next/prev
        const buildQueryString = (fromVal: number) => {
            const query = new URLSearchParams();
            query.append('from', fromVal.toString());
            query.append('size', size.toString());
            if (params.sort) query.append('sort', params.sort);
            if (params.breeds) params.breeds.forEach((b) => query.append('breeds', b));
            if (params.zipCodes) params.zipCodes.forEach((z) => query.append('zipCodes', z));
            if (params.ageMin !== undefined) query.append('ageMin', params.ageMin.toString());
            if (params.ageMax !== undefined) query.append('ageMax', params.ageMax.toString());
            return `/dogs/search?${query.toString()}`;
        };

        return {
            resultIds: paged.map((d) => d.id),
            total,
            next: from + size < total ? buildQueryString(from + size) : undefined,
            prev: from > 0 ? buildQueryString(Math.max(0, from - size)) : undefined
        };
    }

    public async getDogs(dogIds: string[]): Promise<Dog[]> {
        if (dogIds.length === 0) return [];

        // Firestore can handle up to 10 `in` values per query, so we batch if needed
        const batches: string[][] = [];
        const dogIdsDup = [...dogIds];
        while (dogIdsDup.length) {
            batches.push(dogIdsDup.splice(0, 10));
        }

        const dogs: Dog[] = [];

        for (const batch of batches) {
            const q = query(collection(db, 'dogs'), where(documentId(), 'in', batch));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                dogs.push(doc.data() as Dog);
            });
        }

        return dogs;
    }

    public async getMatch(favoriteIds: string[]): Promise<Match> {
        const match = favoriteIds[Math.floor(Math.random() * favoriteIds.length)];
        return { match };
    }

    public async getDogLocations(zipCodes: string[]): Promise<Location[]> {
        if (zipCodes.length === 0) return [];

        const batches: string[][] = [];
        const zipCodesDup = [...zipCodes];
        while (zipCodesDup.length) {
            batches.push(zipCodesDup.splice(0, 10));
        }

        const locations: Location[] = [];

        for (const batch of batches) {
            const q = query(collection(db, 'locations'), where('zip_code', 'in', batch));
            const snapshot = await getDocs(q);
            snapshot.forEach((doc) => locations.push(doc.data() as Location));
        }

        return locations;
    }
}

export default DogService.getInstance();
