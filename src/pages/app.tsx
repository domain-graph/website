import './app.less';

import React, { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useFetch } from 'use-http';
import { DocumentNode, parse } from 'graphql';

import {
  BrowserOpenFileDialog,
  DataProvider,
  DomainGraph,
  OpenFilesResult,
  LocalStorageStateRepository,
  SaveState,
} from 'domain-graph';
import { Loading } from '../icons';
import { useAppContext } from './router';

const repository = new LocalStorageStateRepository();

const useQueryParam = (name: string): string | undefined => {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name) || undefined;
};

const useSchema = (): {
  loading: boolean;
  documentNode?: DocumentNode;
  graphId?: string;
} => {
  const { graphId: appContextGraphId, documentNode: appContextDocumentNode } =
    useAppContext();

  const graphId = useQueryParam('schema');
  const { loading, error, data } = useFetch(
    `.netlify/functions/get-schema?url=${graphId}`,
    {},
    [],
  );

  if (appContextGraphId || appContextDocumentNode) {
    return {
      loading: false,
      graphId: appContextGraphId,
      documentNode: appContextDocumentNode,
    };
  }

  if (!graphId) return { loading: false };

  if (loading || error) return { loading, graphId };

  try {
    return { loading, documentNode: parse(data.schema), graphId };
  } catch (err) {
    console.error(err);
    return { loading, graphId };
  }
};

const useSaveState = (): SaveState | null => {
  const state = useQueryParam('state');

  if (!state) return null;

  try {
    console.log({ state });
    return JSON.parse(atob(state));
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const App: React.VFC = () => {
  const { loading, documentNode, graphId } = useSchema();
  const saveStateFromUrl = useSaveState();
  const { pathname, search } = useLocation();

  const styleLinkRef = useRef<HTMLElement | null>(null);
  const styleLinkParentRef = useRef<ParentNode | null>(null);

  // We remove the styles here to prevent tailwind css from
  // Breaking the DomainGraph app. There is an unfortunate FOUC
  // when navigating to and from this compnent; however, this
  // prevents a FOUC when loading the main page or when navigating
  // to any other non-app pages.
  useEffect(() => {
    styleLinkRef.current = document.getElementById('tailwind');
    styleLinkParentRef.current = styleLinkRef.current?.parentNode || null;
    styleLinkRef.current?.remove();

    return () => {
      if (styleLinkRef.current) {
        styleLinkParentRef.current?.appendChild(styleLinkRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (graphId && saveStateFromUrl) {
      repository.set(graphId, saveStateFromUrl);
    }
  }, [graphId, saveStateFromUrl]);

  const handleDrop = useCallback(async () => {
    return true;
  }, []);

  const handleShowOpenDialog = useCallback(async () => {
    return (
      openFileDialog.current?.open() ||
      Promise.resolve({ canceled: true, files: [] })
    );
  }, []);

  const handleSaveState = useCallback(
    (id: string, saveState: SaveState) => {
      if (id === graphId) {
        const newSearch = new URLSearchParams(search);

        try {
          if (Object.keys(saveState.graph.visibleNodes).length) {
            const state = btoa(JSON.stringify(saveState));
            newSearch.set('state', state);
          } else {
            newSearch.delete('state');
          }
        } catch (err) {
          console.error(err);
          newSearch.delete('state');
        }

        const newLocation = `${pathname}?${newSearch.toString()}`;

        // Intentionally don't use react router's useNavigate.
        // We don't want to trigger a rerender and we don't care if the component doesn't know about the most up-to-date state param in the query
        window.history.replaceState(null, 'New Page Title', newLocation);
      }
    },
    [graphId, search, pathname],
  );

  const openFileDialog = useRef<{ open: () => Promise<OpenFilesResult> }>(null);

  if (loading) {
    return (
      <div className="c-uploader">
        <Loading /> Loading schema from <pre>{graphId}</pre>
      </div>
    );
  }

  if (documentNode && graphId) {
    return (
      <DomainGraph
        graphId={graphId}
        documentNode={documentNode}
        repository={repository}
        onSaveState={handleSaveState}
      />
    );
  }

  return (
    <>
      <DataProvider onDrop={handleDrop} onShowOpenDialog={handleShowOpenDialog}>
        {(providedNode) => (
          <DomainGraph
            graphId="default"
            documentNode={providedNode}
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
