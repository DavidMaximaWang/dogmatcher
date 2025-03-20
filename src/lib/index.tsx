export const FullPageErrorFallback = ({ error }: { error: Error | null }) => <ErrorBox error={error} />;

const isError = (error: any): error is Error => error?.message;

export const ErrorBox = ({ error }: { error: unknown }) => {
    if (isError(error)) {
      return (
          <div
              style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'red',
                  color: 'black',
                  zIndex: 9999
              }}
          >
              {error.message}
          </div>
      );
    }
    return null;
};
