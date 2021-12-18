import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './app';
import { Blog } from './blog';
import { Docs } from './docs';
import { Home } from './home';

import { DocumentNode } from 'graphql';

import Analytics from 'analytics';
import { AnalyticsProvider } from 'use-analytics';
import doNotTrack from 'analytics-plugin-do-not-track';
import googleAnalytics from '@analytics/google-analytics';

const analytics = Analytics({
  app: 'domain-graph',
  plugins: [
    doNotTrack(),
    googleAnalytics({
      trackingId: 'UA-215646920-1',
    }),
  ],
});

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
    <AnalyticsProvider instance={analytics}>
      <AppContext.Provider value={value}>
        <BrowserRouter>
          <NavigationHandler />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="app/*" element={<App />} />
            <Route path="blog/*" element={<Blog />} />
            <Route path="docs/*" element={<Docs />} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </AnalyticsProvider>
  );
};

const NavigationHandler: React.VFC = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.page();
  }, [location.pathname, location.search, location.hash]);

  return null;
};
