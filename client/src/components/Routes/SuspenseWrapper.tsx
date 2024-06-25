import Loader from '@components/Loaders/Loader';
import React, { Suspense } from 'react';

interface ISuspenseWrapperProps {
  path: string;
}

const SuspenseWrapper = (props: ISuspenseWrapperProps) => {
  // The above dynamic import cannot be analyzed by Vite.
  // @see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
  const LazyComponent = React.lazy(
    () => import(/* @vite-ignore */ `../../${props.path}`),
  );

  return (
    <Suspense fallback={<Loader />}>
      <LazyComponent />
    </Suspense>
  );
};

export default SuspenseWrapper;
