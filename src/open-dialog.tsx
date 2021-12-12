import { OpenFilesResult } from 'domain-graph';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';

export interface BrowserOpenFileDialogProps {
  accept?: string;
  multiple?: boolean;
  onCancel?: () => void;
  onFiles?: (result: OpenFilesResult) => void;
}

export const BrowserOpenFileDialog = forwardRef(
  (
    { accept, multiple, onCancel, onFiles }: BrowserOpenFileDialogProps,
    ref,
  ) => {
    const timer = useRef<NodeJS.Timeout>();
    const inputRef = useRef<HTMLInputElement>(null);
    const isOpen = useRef<boolean>();

    useImperativeHandle(ref, () => ({
      open: () => {
        inputRef.current?.focus();
        inputRef.current?.click();
        isOpen.current = true;
      },
    }));

    const handleFocus = useCallback(() => {
      const delay = 100;

      if (isOpen.current) {
        timer.current = setTimeout(() => {
          onCancel?.();
          isOpen.current = false;
        }, delay) as unknown as NodeJS.Timeout;
      }
    }, [onCancel]);

    const handleChange = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (timer.current) clearTimeout(timer.current);

        const files: OpenFilesResult['files'] = [];

        if (event.target.files) {
          for (let i = 0; i < event.target.files.length; i++) {
            const item = event.target.files.item(i);

            if (item) {
              files.push({
                filePath: item?.name,
                contents: await item.text(),
              });
            }
          }
        }

        onFiles?.({
          canceled: false,
          files,
        });

        isOpen.current = false;
      },
      [onFiles],
    );

    return (
      <label
        style={{ opacity: 0, pointerEvents: 'none', position: 'fixed' }}
        tabIndex={-1}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </label>
    );
  },
);
