import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { useDogsInfiniteQuery } from '../hooks/useDogQueries';
import DogService from '../services/dog';

const { from, size, sort } = { from: 0, size: 24, sort: 'breed:asc' };

function TestComponent({ onData }: { onData: (data: any) => void }) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useDogsInfiniteQuery({ from, size, sort });

    if (!data) {
        return <div>Loading...</div>;
    }

    onData(data.pages);

    return (
        <div>
            {data.pages.flatMap((page) => page.resultIds.map((id) => <p key={id}>{id}</p>))}
            {hasNextPage && (
                <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                </button>
            )}
        </div>
    );
}

describe('useDogsInfiniteQuery', () => {
    let resultData: any;

    const firstPage = {
        next: '/dogs/search?size=24&from=24&sort=breed%3Aasc',
        resultIds: ['Dog1', 'Dog2'],
        total: 100
    };

    const secondPage = {
        next: '/dogs/search?size=24&from=48&sort=breed%3Aasc',
        resultIds: ['Dog3', 'Dog4'],
        total: 100
    };
    beforeAll(() => {
        jest.spyOn(DogService, 'searchDogs').mockResolvedValueOnce(firstPage).mockResolvedValueOnce(secondPage);
    });

    beforeEach(() => {
        resultData = undefined;
    });

    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <TestComponent onData={(data) => (resultData = data)} />
            </QueryClientProvider>
        );
    };

    it('fetches initial dogs and loads more on demand', async () => {
        const { getByText, findByText } = renderComponent();

        await waitFor(() => {
            expect(DogService.searchDogs).toHaveBeenCalledWith({ from, size, sort });
            expect(getByText('Dog1')).toBeInTheDocument();
            expect(getByText('Dog2')).toBeInTheDocument();
            expect(resultData[0].next).toEqual('/dogs/search?size=24&from=24&sort=breed%3Aasc');
            expect(resultData[0].total).toEqual(100);
        });

        const loadMoreButton = getByText('Load More');
        loadMoreButton.click();

        await waitFor(async () => {
            expect(DogService.searchDogs).toHaveBeenCalledWith({ from: 24, size, sort });
            expect(await findByText('Dog3')).toBeInTheDocument();
            expect(await findByText('Dog4')).toBeInTheDocument();

            expect(getByText('Dog1')).toBeInTheDocument();
            expect(getByText('Dog2')).toBeInTheDocument();
            expect(resultData[0].total).toEqual(100);
        });
    });
});