import './app.less';

import React, { useCallback, useRef } from 'react';

import {
  BrowserOpenFileDialog,
  DataProvider,
  DomainGraph,
  OpenFilesResult,
  LocalStorageStateRepository,
} from 'domain-graph';

const repository = new LocalStorageStateRepository();

export const App: React.VFC = () => {
  const handleDrop = useCallback(async () => {
    return true;
  }, []);

  const handleShowOpenDialog = useCallback(async () => {
    return (
      openFileDialog.current?.open() ||
      Promise.resolve({ canceled: true, files: [] })
    );
  }, []);

  const openFileDialog = useRef<{ open: () => Promise<OpenFilesResult> }>(null);

  return (
    <>
      <DataProvider onDrop={handleDrop} onShowOpenDialog={handleShowOpenDialog}>
        {(introspection) => (
          <DomainGraph
            graphId="default"
            introspection={introspection}
            repository={repository}
          />
        )}
      </DataProvider>
      <BrowserOpenFileDialog
        ref={openFileDialog}
        accept=".json,.gql,.graphql"
        multiple
      />
    </>
  );
};
