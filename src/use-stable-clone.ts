import { useState, useRef, useEffect } from 'react';

export function useStableClone<TItem, TClone extends TItem>(
  items: TItem[],
  compare: (a: TItem, b: TItem & Partial<Omit<TClone, keyof TItem>>) => boolean,
): (TItem & Partial<Omit<TClone, keyof TItem>>)[] {
  type C = TItem & Partial<Omit<TClone, keyof TItem>>;

  const [clonedNodes, setClonedNodes] = useState<C[]>(
    items.map((item) => ({ ...item })),
  );

  const compareFn = useRef(compare);
  useEffect(() => {
    compareFn.current = compare;
  }, [compare]);

  useEffect(() => {
    setClonedNodes((prev) =>
      items.map((nextNode) => {
        const prevNode = prev.find((n) => compareFn.current(nextNode, n));

        if (prevNode) {
          for (const key of Object.keys(nextNode)) {
            prevNode[key] = nextNode[key];
          }
          return prevNode;
        } else {
          return { ...nextNode };
        }
      }),
    );
  }, [items]);

  return clonedNodes;
}
