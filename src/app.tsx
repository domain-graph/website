import './app.less';

import React, { useCallback, useState } from 'react';

import UploadCloud from 'domain-graph/lib/icons/upload-cloud';
type Schema = DomainGraphProps['schema'];

import { DomainGraph, DomainGraphProps } from 'domain-graph';

export const App: React.VFC<{}> = () => {
  const [schema, setSchema] = useState<Schema>();

  const [dropReady, setDropReady] = useState(false);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
    },
    [],
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      // Prevent default behavior (Prevent file from being opened)
      event.preventDefault();

      const file = event.dataTransfer.files[0];

      const arrayBuffer = await file.arrayBuffer();

      const text = new TextDecoder().decode(arrayBuffer);

      setSchema(JSON.parse(text));
    },
    [],
  );

  if (schema) return <DomainGraph schema={schema} />;

  return (
    <div
      className={`c-uploader${dropReady ? ' drop-ready' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={() => setDropReady(true)}
      onDragLeave={() => setDropReady(false)}
      onDrop={handleDrop}
    >
      <UploadCloud size={200} strokeWidth={8} />
      <h1>Drop a schema file here to get started!</h1>

      <p>
        To get a schema file, run the Apollo introspection query. Save the
        results and drag the file into this box.
      </p>
    </div>
  );
};
