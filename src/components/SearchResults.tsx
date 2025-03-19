import { useSearchParams } from 'react-router-dom';
import { useDogsInfiniteQuery } from '../hooks/useDogQueries';
import styles from '../styles/SearchResults.module.css';
import buildDogSearchQuery from '../utils';
import DogsPage from './DogsPage';


function SearchResults() {
    const [searchParams] = useSearchParams();
    const dogsQuery = buildDogSearchQuery(searchParams);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useDogsInfiniteQuery(dogsQuery);

    if (isLoading) {
        return <p className={styles.loading}>Loading dogs...</p>;
    }

    if (isError) {
        return <p className={styles.error}>Error loading dogs. Please try again.</p>;
    }

    const handleLoadMore = () => {
        fetchNextPage();
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
