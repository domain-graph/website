import React from 'react';
import { Template } from './template';

export const Section: React.VFC<{
  header: string;
  text: string;
  img: string;
  type: 'left' | 'right';
}> = ({ header, text, img, type }) => (
  <div
    className={`flex justify-center flex-row ${
      type === 'left' ? 'bg-white' : ''
    } py-48`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-6xl">
      <img className="col-span-1 shadow-2xl shadow-black/60" src={img} />
      <div className="col-span-1 flex flex-col justify-center">
        <h2 className="text-3xl mb-12 font-bold">{header}</h2>
        <p>{text}</p>
      </div>
    </div>
  </div>
);
export const Home: React.VFC = () => (
  <Template>
    <div className="my-12 sm:my-36 md:my-56 text-center">
      <h1 className="text-8xl mb-12 font-bold">Domain Graph</h1>
      <div className="text-3xl">
        Beautiful, interactive visualizations for GraphQL schemas
      </div>
    </div>
    <Section
      header="Easily preview schema files 🔎"
      img="/images/preview-button.gif"
      text="Use the preview button on .graphql files to open the Domain Graph
        visualization. Just like previewing markdown files, changes to your
        schema file will be reflected on the Domain Graph in real-time.
        Guaranteed to be the best-looking API docs on the planet or your money
        back!"
      type="left"
    />
    <Section
      header="Explore your graph 🧭"
      img="/images/hero.png"
      text="Intuitively expand and collapses types as you move across your graph.
      It's a fun, satisfying way to discover the Domain Objects in your API
      and how they connect to each other."
      type="right"
    />
    <Section
      header="Discover deeper nuance 🧠"
      img="/images/hero.png"
      text="Drill into specific Domain Objects and Relations to understand
      individual properties and nuanced descriptions."
      type="left"
    />
    <Section
      header="Trust your documentation ❤️"
      img="/images/hero.png"
      text="Gorgeous enough that you won't want to look away, and accurate enough
      that you don't need to. By directly rendering your actual GraphQL
      schema, this documentation is always guaranteed to be in lockstep with
      your API—if it's in the schema, then it's in the docs! 😄"
      type="right"
    />
    <section className="text-center bg-white py-24">
      <div className="text-sm">
        © {new Date().getFullYear()}{' '}
        <a href="https://github.com/skonves">Steve Konves</a>
      </div>
      <div className="text-sm mt-6">Product of Arizona</div>
      <div className="text-sm mt-2">🌵</div>
    </section>
  </Template>
);
