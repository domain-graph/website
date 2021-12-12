import { IconProps } from 'domain-graph/lib/icons/base';
import * as Icons from 'domain-graph/lib/icons';
import React, { useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github } from '../icons';
import { Template } from './template';
import { BrowserOpenFileDialog } from '../open-dialog';
import { OpenFilesResult } from 'domain-graph';
import { useAppContext } from './router';
import { parse } from 'graphql';

const Section: React.VFC<{
  header: string;
  text: string;
  img?: string;
  imgLink?: string;
  imgExtLink?: string;
  type: 'left' | 'right';
}> = ({ header, text, img, imgLink, imgExtLink, type }) => (
  <div
    className={`flex justify-center flex-row ${
      type === 'left' ? 'bg-white' : ''
    } py-48`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-6xl">
      {!!img && !imgLink && !imgExtLink && (
        <img className="rounded col-span-1 shadow-2xl shadow-black/60" src={img} />
      )}
      {!!img && !!imgExtLink && (
        <a href={imgExtLink}>
          <img className="rounded col-span-1 shadow-2xl shadow-black/60" src={img} />
        </a>
      )}
      {!!img && !!imgLink && (
        <Link to={imgLink}>
          <img className="rounded col-span-1 shadow-2xl shadow-black/60" src={img} />
        </Link>
      )}
      <div
        className={`${
          img ? 'col-span-1' : 'col-span-2'
        } flex flex-col justify-center`}
      >
        <h2 className="text-3xl mb-12 font-bold">{header}</h2>
        <p>{text}</p>
      </div>
    </div>
  </div>
);

const SchemaCard: React.VFC<{
  name: string;
  description: string;
  url?: string;
  onClick?: () => void;
  Icon: React.VFC<IconProps>;
}> = ({ name, description, url = '#', Icon, onClick }) => (
  <div className="bg-white w-48 m-8 rounded shadow hover:shadow-lg duration-100 text-left">
    <Link
      className="p-4 block flex items-center flex-col"
      onClick={onClick}
      to={url}
    >
      <div className="m-8">
        <Icon size={72} strokeWidth={4} />
      </div>
      <div className="font-bold">{name}</div>
      <div className="">{description}</div>
    </Link>
  </div>
);

export const Home: React.VFC = () => {
  const handleShowOpenDialog = useCallback(() => {
    openFileDialog.current?.open();
  }, []);

  const openFileDialog = useRef<{ open: () => void }>(null);

  const { setState } = useAppContext();

  const navigate = useNavigate();

  const handleFile = useCallback(
    (result: OpenFilesResult) => {
      if (result.canceled) return;
      const file = result.files[0];
      if (file) {
        try {
          setState({
            graphId: file.filePath,
            documentNode: parse(file.contents),
          });
          navigate('/app');
        } catch (err) {
          console.error(err);
        }
      }
    },
    [setState, navigate],
  );

  return (
    <Template>
      <div className="my-12 sm:my-36 md:my-56 text-center">
        <h1 className="text-8xl mb-12 font-bold">Domain Graph</h1>
        <div className="text-3xl">
          Beautiful, interactive visualizations for GraphQL schemas
        </div>

        <h2 className="mt-24 text-xl">Try it out with one of these live examples!</h2>
        <div className="flex justify-center items-center">
          <SchemaCard
            name="Github"
            Icon={Github}
            description="Public schema for the GitHub GraphQL API"
            url="/app?schema=https://docs.github.com/public/schema.docs.graphql&state=eyJncmFwaCI6eyJ2aXNpYmxlTm9kZXMiOnsiUmVwb3NpdG9yeSI6eyJpZCI6IlJlcG9zaXRvcnkiLCJpc1Bpbm5lZCI6dHJ1ZSwieCI6MjMxLCJ5IjotMTc1LjF9LCJVc2VyIjp7ImlkIjoiVXNlciIsImlzUGlubmVkIjp0cnVlLCJ4IjotMjc3LjgsInkiOjIxNi40fSwiT3JnYW5pemF0aW9uIjp7ImlkIjoiT3JnYW5pemF0aW9uIiwiaXNQaW5uZWQiOnRydWUsIngiOi0zMjAuMiwieSI6LTI3N319LCJzZWxlY3RlZFNvdXJjZU5vZGVJZCI6IlJlcG9zaXRvcnkiLCJzZWxlY3RlZEZpZWxkSWQiOiJSZXBvc2l0b3J5LmNvbGxhYm9yYXRvcnN%2Bc2ltcGxlLWNvbm5lY3Rpb25zIiwic2VsZWN0ZWRUYXJnZXROb2RlSWQiOiJVc2VyIn0sImNhbnZhcyI6eyJzY2FsZSI6MSwieCI6MCwieSI6MH19"
          />
          <SchemaCard
            name="SWAPI"
            Icon={Icons.Graph}
            description="Unofficial GraphQL API for Star Wars data"
            url="/app?schema=https://raw.githubusercontent.com/graphql/swapi-graphql/master/schema.graphql&state=eyJncmFwaCI6eyJ2aXNpYmxlTm9kZXMiOnsiVmVoaWNsZSI6eyJpZCI6IlZlaGljbGUiLCJpc1Bpbm5lZCI6dHJ1ZSwieCI6LTIxOS45LCJ5Ijo4N30sIlBlcnNvblZlaGljbGVzQ29ubmVjdGlvbiI6eyJpZCI6IlBlcnNvblZlaGljbGVzQ29ubmVjdGlvbiIsImlzUGlubmVkIjp0cnVlLCJ4IjotMTE4LjksInkiOi03NH0sIlBhZ2VJbmZvIjp7ImlkIjoiUGFnZUluZm8iLCJpc1Bpbm5lZCI6dHJ1ZSwieCI6LTIzNy4yLCJ5IjotMjU0LjF9LCJQZXJzb24iOnsiaWQiOiJQZXJzb24iLCJpc1Bpbm5lZCI6dHJ1ZSwieCI6MTguOSwieSI6ODQuOH0sIlNwZWNpZXMiOnsiaWQiOiJTcGVjaWVzIiwiaXNQaW5uZWQiOnRydWUsIngiOjI0Mi42LCJ5Ijo2MC45fSwiUGxhbmV0Ijp7ImlkIjoiUGxhbmV0IiwiaXNQaW5uZWQiOnRydWUsIngiOjEwNy40LCJ5IjotMTA5Ljh9fSwic2VsZWN0ZWRTb3VyY2VOb2RlSWQiOiJQZXJzb24ifSwiY2FudmFzIjp7InNjYWxlIjoxLCJ4IjowLCJ5IjowfX0%3D"
          />
          <SchemaCard
            name="Upload"
            Icon={Icons.UploadCloud}
            description="Upload a .graphql file and start exploring"
            onClick={handleShowOpenDialog}
          />
          <BrowserOpenFileDialog
            ref={openFileDialog}
            onFiles={handleFile}
            accept=".gql,.graphql"
          />
        </div>
      </div>
      <Section
        header="Search, Explore, Understand"
        img="/images/workflow.gif"
        imgLink="/app?schema=https%3A%2F%2Fdocs.github.com%2Fpublic%2Fschema.docs.graphql&state=eyJncmFwaCI6eyJ2aXNpYmxlTm9kZXMiOnsiVXNlciI6eyJpZCI6IlVzZXIiLCJpc1Bpbm5lZCI6dHJ1ZSwieCI6OTAuMiwieSI6LTIxMC42fSwiT3JnYW5pemF0aW9uIjp7ImlkIjoiT3JnYW5pemF0aW9uIiwiaXNQaW5uZWQiOnRydWUsIngiOi0yMjMuMiwieSI6LTEzOX0sIkNvbW1pdENvbW1lbnQiOnsiaWQiOiJDb21taXRDb21tZW50IiwiaXNQaW5uZWQiOnRydWUsIngiOi0xMjAuMywieSI6MTA3LjR9LCJBY3RvciI6eyJpZCI6IkFjdG9yIiwiaXNQaW5uZWQiOnRydWUsIngiOjEyOS4zLCJ5Ijo0MC4yfX0sInNlbGVjdGVkU291cmNlTm9kZUlkIjoiQ29tbWl0Q29tbWVudCIsInNlbGVjdGVkRmllbGRJZCI6IkNvbW1pdENvbW1lbnQuYXV0aG9yIiwic2VsZWN0ZWRUYXJnZXROb2RlSWQiOiJBY3RvciJ9LCJjYW52YXMiOnsic2NhbGUiOjEsIngiOjAsInkiOjB9fQ%3D%3D"
        text="The search bar provides access to all of the Domain Objects and their connections in a GraphQL schema. Find a type, then start exploring by expanding and moving things around."
        type="left"
      />
      <Section
        header="Domain-Driven GraphQL"
        text="Take productivity and shared project understanding to the next level by building your authoritative Domain Model right in GraphQL. Using Domain-Driven Design, subject matter experts, designers, and developers design a product Domain Model as the formal representation of all of the things and actions that the product will do. Domain Graph lets you cut out the middleman and design your Domain Model with GraphQL. When you’re done designing, you already have your API. When you change your design, your API will reflect those changes for free."
        type="right"
      />
      <Section
        header="Simple Relay Connections"
        img="/images/relay.png"
        imgLink="/app?schema=https%3A%2F%2Fdocs.github.com%2Fpublic%2Fschema.docs.graphql&state=eyJncmFwaCI6eyJ2aXNpYmxlTm9kZXMiOnsiUmVwb3NpdG9yeSI6eyJpZCI6IlJlcG9zaXRvcnkiLCJpc1Bpbm5lZCI6dHJ1ZSwieCI6LTE3My4xLCJ5IjotMzIuOX0sIkRpc2N1c3Npb24iOnsiaWQiOiJEaXNjdXNzaW9uIiwiaXNQaW5uZWQiOnRydWUsIngiOjc0LjEsInkiOi0xODkuNX19LCJzZWxlY3RlZFNvdXJjZU5vZGVJZCI6IlJlcG9zaXRvcnkiLCJzZWxlY3RlZEZpZWxkSWQiOiJSZXBvc2l0b3J5LmRpc2N1c3Npb25zfnNpbXBsZS1jb25uZWN0aW9ucyIsInNlbGVjdGVkVGFyZ2V0Tm9kZUlkIjoiRGlzY3Vzc2lvbiJ9LCJjYW52YXMiOnsic2NhbGUiOjEsIngiOjAsInkiOjB9fQ%3D%3D"
        text="Relay connections are the defacto method for supporting pagination within GraphQL. Domain Graph visually simplifies all of the nodes, edges, and page info into a single connection between two types. The Relay icon indicates which connections support Relay pagination."
        type="left"
      />
      <Section
        header="Not just for Engineers"
        text="Domain Graph provides a multimodal way to understand your product. The combination of visual connections, textual descriptions, and interactive exploration is incredibly accessible for anyone. It provides developers a way to communicate the functionality that already exists and it provides product managers and designers a common language for discussing future plans."
        type="right"
      />
      <Section
        header="Build better APIs"
        img="/images/understand.png"
        imgLink="/app?schema=https%3A%2F%2Fdocs.github.com%2Fpublic%2Fschema.docs.graphql&state=eyJncmFwaCI6eyJ2aXNpYmxlTm9kZXMiOnsiQWN0b3IiOnsiaWQiOiJBY3RvciIsImlzUGlubmVkIjp0cnVlLCJ4IjotOTQuNywieSI6LTI1My44fSwiSXNzdWUiOnsiaWQiOiJJc3N1ZSIsImlzUGlubmVkIjp0cnVlLCJ4IjotMzMxLjMsInkiOi03Ny43fSwiVXNlciI6eyJpZCI6IlVzZXIiLCJpc1Bpbm5lZCI6dHJ1ZSwieCI6LTk1LjYsInkiOjEwMC44fSwiUHVsbFJlcXVlc3QiOnsiaWQiOiJQdWxsUmVxdWVzdCIsImlzUGlubmVkIjp0cnVlLCJ4IjoxNjMuNywieSI6LTgxfX0sInNlbGVjdGVkU291cmNlTm9kZUlkIjoiUHVsbFJlcXVlc3QiLCJzZWxlY3RlZEZpZWxkSWQiOiJQdWxsUmVxdWVzdC5tZXJnZWRCeSIsInNlbGVjdGVkVGFyZ2V0Tm9kZUlkIjoiQWN0b3IifSwiY2FudmFzIjp7InNjYWxlIjoxLCJ4IjowLCJ5IjowfX0%3D"
        text="If you can’t see it, you won’t fix it. Domain Graph puts your API out in the open allowing everyone to explore and provide feedback. Gaps in understanding get fixed by directly improving your GraphQL schema."
        type="left"
      />
      <Section
        header="Available for VS Code"
        img="/images/vscode.gif"
        imgExtLink="https://marketplace.visualstudio.com/items?itemName=stevekonves.domain-graph-vscode"
        text="Domain Graph is available as an extension for VS Code. Use the preview button on .graphql files to open the Domain Graph visualization. Just like previewing markdown files, changes to your schema file will be reflected on the Domain Graph in real-time. Guaranteed to be the best-looking API docs on the planet or your money back!"
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
};
