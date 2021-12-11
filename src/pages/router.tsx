import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './app';
import { Blog } from './blog';
import { Docs } from './docs';
import { Home } from './home';

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="app/*" element={<App />} />
      <Route path="blog/*" element={<Blog />} />
      <Route path="docs/*" element={<Docs />} />
    </Routes>
  </BrowserRouter>
);
