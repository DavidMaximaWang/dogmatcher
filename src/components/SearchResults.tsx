import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { useDogsInfiniteQuery } from '../hooks/useDogQueries';
import styles from '../styles/SearchResults.module.css';
import buildDogSearchQuery from '../utils';
import DogsPage from './DogsPage';
import { useDogContext } from '../context/DogsContext';


function SearchResults() {
    const {total, setTotal, setSearchResultLoadedCallback} = useDogContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dogsQuery = useMemo(() => buildDogSearchQuery(searchParams), [searchParams]);
    const { id: dogId } = useParams<{ id: string }>();
    const inDogDetailsPage = dogId;

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

      const setTotalValue = useCallback((value: number | undefined) => setTotal(value), [setTotal]);

      useEffect(() => {
          if (data) {
              setTotalValue(data.pages[0].total);
              setSearchResultLoadedCallback(true);
          } else {
            setSearchResultLoadedCallback(false);
          }

          return () => {
                setSearchResultLoadedCallback(false);
                setTotalValue(undefined);
        };
      }, [data, setTotalValue, setSearchResultLoadedCallback]);


      const debouncedFetchNextPage = useDebounce(fetchNextPage, 1000);

    if (isLoading) {
        return <p className={styles.loading}>Loading dogs...</p>;
    }

    if (isError) {

        return <p className={styles.error}>Error loading dogs. Please try again.</p>;
    }

    const handleLoadMore = () => debouncedFetchNextPage();
    if (inDogDetailsPage && (total === 1 || total === undefined) ) {
        return null;
    }
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