import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './logo';

export const HeaderLink: React.FC<{
  to: string;
  external?: boolean;
}> = ({ children, to, external }) => (
  <li>
    {external ? (
      <a className="p-8" href={to}>
        {children}
      </a>
    ) : (
      <Link className="p-8" to={to}>
        {children}
      </Link>
    )}
  </li>
);

export const Template: React.FC = ({ children }) => (
  <div>
    <div className="sticky top-0 bg-eggshell flex items-center justify-between shadow">
      <Link to="/" className="flex items-center p-2">
        <Logo className="w-12 h-12 m-4" />
        <h1 className="text-2xl">Domain Graph</h1>
      </Link>

      <nav>
        <ul className="flex">
          <HeaderLink to="/app">Try it out!</HeaderLink>
          <HeaderLink to="/docs">Documentation</HeaderLink>
          <HeaderLink to="/blog">Blog</HeaderLink>
          <HeaderLink
            to="https://marketplace.visualstudio.com/items?itemName=stevekonves.domain-graph-vscode"
            external
          >
            VS Code extension
          </HeaderLink>
          <HeaderLink to="https://github.com/domain-graph" external>
            Github
          </HeaderLink>
        </ul>
      </nav>
    </div>
    <section className="flex justify-center flex-col">{children}</section>
  </div>
);
