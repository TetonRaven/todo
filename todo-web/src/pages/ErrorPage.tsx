import { isRouteErrorResponse, useRouteError } from 'react-router';

export function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1 className='page-title'>{error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className='page-title'>Something went wrong</h1>
      <p>An unexpected error occurred.</p>
    </div>
  );
}