import { AxiosError } from 'axios';
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { useDogsInfiniteQuery } from '../hooks/useDogQueries';
import styles from '../styles/SearchResults.module.css';
import buildDogSearchQuery from '../utils';
import DogsPage from './DogsPage';
import { useDogContext } from '../context/DogsContext';


function SearchResults() {
    const {setTotal} = useDogContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dogsQuery = useMemo(() => buildDogSearchQuery(searchParams), [searchParams]);

    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useDogsInfiniteQuery(dogsQuery);

    useEffect(() => {
        if (!error) {
            return;
        }
        const axiosError = error as AxiosError;

        if (axiosError?.status === 401) {
            console.error('Unauthorized - Redirecting to login...');
            navigate('/login');
        }
      }, [error, navigate]);

        setTotal(data?.pages[0].total)


      const debouncedFetchNextPage = useDebounce(fetchNextPage, 1000);

    if (isLoading) {
        return <p className={styles.loading}>Loading dogs...</p>;
    }

    if (isError) {

        return <p className={styles.error}>Error loading dogs. Please try again.</p>;
    }

    const handleLoadMore = () => debouncedFetchNextPage();

    return (
        <div className={styles.dogsGridWrapper}>
            <div className={styles.dogsGrid}>
                {data?.pages.map((page, pageIndex) => (
                    <DogsPage key={pageIndex} page={page} isLastPage={pageIndex === data.pages.length - 1} isFirstPage={pageIndex === 0}/>
                ))}
            </div>
            <div className={styles.loadMore}>
                <button onClick={handleLoadMore} disabled={isFetchingNextPage || !hasNextPage}>
                    {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                </button>
            </div>
        </div>
    );
}

export default SearchResults;
