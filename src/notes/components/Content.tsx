import { h } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import keyboardShortcuts, { KeyboardShortcut } from "notes/keyboard-shortcuts";
import { useKeyboardShortcut } from "notes/hooks/use-keyboard-shortcut";
import { commands, InsertTabFactory } from "../commands";
import __range from "notes/range";

import { isImageFile } from "./image/read-image";
import { dropImage } from "./image/drop-image";
import { runUploadPreconditions } from "background/google-drive/preconditions/upload-preconditions";
import { reinitTables } from "notes/content/table";

interface ContentProps {
  active: string
  locked: boolean
  initialContent: string
  onEdit: (active: string, content: string) => void
  indentOnTab: boolean
  tabSize: number
}

const autofocus = (content: HTMLDivElement) => content && window.setTimeout(() => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.setStart(content, 0);
  range.setEnd(content, 0);

  selection.removeAllRanges();
  selection.addRange(range);
});

const openLink = (event: MouseEvent) => {
  if (!document.body.classList.contains("with-control")) {
    return;
  }

  event.preventDefault();
  const target = event.target;
  const href = target && (target as HTMLLinkElement).href;
  if (href && ["http", "chrome-extension"].some((protocol) => href.startsWith(protocol))) {
    window.open(href, "_blank");
  }
};

let latestCb: () => void;
const reattachEditNote = (cb: () => void) => {
  document.removeEventListener("editnote", latestCb);
  latestCb = cb;
  document.addEventListener("editnote", latestCb);
};

const Content = ({ active, locked, initialContent, onEdit, indentOnTab, tabSize }: ContentProps): h.JSX.Element => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [setIndentOnTabHandlerOnTab] = useKeyboardShortcut(KeyboardShortcut.OnTab);

  const onInput = useCallback(() => {
    if (active && contentRef.current) {
      const content = contentRef.current.innerHTML;
      onEdit(active, content);
    }
  }, [active]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = initialContent;
      autofocus(contentRef.current);
      reinitTables({
        onResize: () => {
          const event = new Event("editnote");
          document.dispatchEvent(event);
        }
      });
    }
  }, [active, initialContent]);

  // Toolbar controls (e.g. TABLE_INSERT) can change #content.innerHTML.
  // To save the changed content, "editnote" event is triggered from Toolbar.
  useEffect(() => reattachEditNote(onInput), [onInput]);

  useEffect(() => setIndentOnTabHandlerOnTab(
    indentOnTab
      ? InsertTabFactory({ tabSize })
      : undefined
  ), [indentOnTab, tabSize]);

  useEffect(() => {
    keyboardShortcuts.subscribe(KeyboardShortcut.OnUnderline, commands.Underline);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnStrikethrough, commands.StrikeThrough);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnRemoveFormat, commands.RemoveFormat);

    keyboardShortcuts.subscribe(KeyboardShortcut.OnUnorderedList, commands.UL);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnOrderedList, commands.OL);

    keyboardShortcuts.subscribe(KeyboardShortcut.OnInsertDate, commands.InsertCurrentDate);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnInsertTime, commands.InsertCurrentTime);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnInsertDateAndTime, commands.InsertCurrentDateAndTime);
  }, []);

  return (
    <div
      id="content"
      className={locked ? "locked" : undefined}
      ref={contentRef}
      contentEditable
      spellcheck
      autofocus
      onInput={onInput}
      onClick={openLink}
      onDragEnter={() => {
        __range.empty();
      }}
      onDrop={async (event) => {
        const file = event.dataTransfer?.files[0];
        if (!file || !isImageFile(file)) {
          return;
        }

        event.preventDefault();
        document.body.classList.add("locked");

        const result = await runUploadPreconditions();
        if (!result) {
          document.body.classList.remove("locked");
          return;
        }

        const { sync, token } = result;
        await dropImage({
          event,
          sync,
          token,
          file,
          onComplete: onInput,
        });
      }}
    />
  );
};

export default Content;
