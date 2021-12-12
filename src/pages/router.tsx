import React, { useContext, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './app';
import { Blog } from './blog';
import { Docs } from './docs';
import { Home } from './home';

import { DocumentNode } from 'graphql';

export type AppState = {
  graphId?: string;
  documentNode?: DocumentNode;
};

const AppContext = React.createContext<
  {
    setState: (state: AppState) => void;
  } & AppState
>({
  setState: () => {
    // No op
  },
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const Router = () => {
  const [state, setState] = useState<AppState>({});
  const value = useMemo(
    () => ({
      ...state,
      setState,
    }),
    [state],
  );

  return (
    <AppContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="app/*" element={<App />} />
          <Route path="blog/*" element={<Blog />} />
          <Route path="docs/*" element={<Docs />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};
