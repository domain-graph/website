import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '../icons';
import { Logo } from './logo';

export const HeaderLink: React.FC<{
  to: string;
  external?: boolean;
}> = ({ children, to, external }) => (
  <li>
    {external ? (
      <a className="p-2 md:p-6" href={to}>
        {children}
      </a>
    ) : (
      <Link className="p-2 md:p-6" to={to}>
        {children}
      </Link>
    )}
  </li>
);

export const Template: React.FC = ({ children }) => {
  const [show, setShow] = useState(false);
  const handleClick = useCallback(() => setShow(!show), [show]);
  return (
    <div>
      <div className="shadow bg-eggshell md:sticky md:top-0 md:flex md:justify-between md:items-center">
        <div className="flex justify-between">
          <Link to="/" className="flex items-center p-2">
            <Logo className="w-12 h-12 m-4" />
            <h1 className="text-2xl">Domain Graph</h1>
          </Link>
          <button className="md:hidden p-8" onClick={handleClick}>
            <Menu />
          </button>
        </div>

        <nav className={`${show ? '' : 'hidden'} md:block text-center text-xl pb-4 md:pb-0`}>
          <ul className="md:flex">
            <HeaderLink to="https://github.com/sponsors/skonves" external>
              ❤️ Sponsor
            </HeaderLink>
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
};
