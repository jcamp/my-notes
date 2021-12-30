import { Log } from "shared/logger";
import { NotesObject } from "shared/storage/schema";
import {
  saveTextToLocalMyNotes,
  saveTextToRemotelyOpenMyNotes,
  CLIPBOARD_NOTE_NAME,
} from "./saving";

const ID = "my-notes";

const MY_NOTES_SAVE_URL_TO_CLIPBOARD = "my-notes-save-url-to-clipboard";
const MY_NOTES_SAVE_SELECTION_TO_CLIPBOARD = "my-notes-save-selection-to-clipboard";

const MY_NOTES_SAVE_SELECTION_TO_NOTE_PREFIX = "my-notes-save-selection-to-note-";
const MY_NOTES_SAVE_SELECTION_TO_REMOTE = "my-notes-save-selection-to-remote";

const getPageUrlHtml = (pageUrl: string) => `<a href="${pageUrl}" target="_blank">${pageUrl}</a>`;

const getUrlToSave = (info: chrome.contextMenus.OnClickData) => {
  const { pageUrl } = info;
  const pageUrlHtml = getPageUrlHtml(pageUrl);
  const toSave = `${pageUrlHtml}<br><br>`;
  return toSave;
};

const getSelectionToSave = (info: chrome.contextMenus.OnClickData) => {
  const { pageUrl, selectionText } = info;
  const pageUrlHtml = getPageUrlHtml(pageUrl);
  const toSave = `${selectionText}<br><b>(${pageUrlHtml})</b><br><br>`;
  return toSave;
};

const isLocked = (notes: NotesObject, noteName: string): boolean => !!(notes[noteName]?.locked);

/**
 * Creates My Notes Context menu
 *
 * To use the Context menu, select a text on
 * a website and follow with a right-click
 *
 * Required permission: "contextMenus" (see manifest.json)
 */
const createContextMenu = (notes: NotesObject): void => {
  chrome.contextMenus.create({
    id: ID,
    title: "My Notes",
    contexts: ["page", "selection"],
  }, () => {
    chrome.contextMenus.create({
      parentId: ID,
      id: MY_NOTES_SAVE_URL_TO_CLIPBOARD,
      title: `Save URL to ${CLIPBOARD_NOTE_NAME}`,
      contexts: ["page"],
      enabled: !isLocked(notes, CLIPBOARD_NOTE_NAME),
    });
    chrome.contextMenus.create({
      parentId: ID,
      id: MY_NOTES_SAVE_SELECTION_TO_CLIPBOARD,
      title: `Save to ${CLIPBOARD_NOTE_NAME}`,
      contexts: ["selection"],
      enabled: !isLocked(notes, CLIPBOARD_NOTE_NAME),
    });
    chrome.contextMenus.create({
      parentId: ID,
      id: "my-notes-separator-one",
      type: "separator",
      contexts: ["selection"],
    });
    Object.keys(notes).sort().forEach((noteName) => {
      chrome.contextMenus.create({
        parentId: ID,
        id: `${MY_NOTES_SAVE_SELECTION_TO_NOTE_PREFIX}${noteName}`,
        title: `Save to ${noteName}`,
        contexts: ["selection"],
        enabled: !isLocked(notes, noteName),
      });
    });
    chrome.contextMenus.create({
      parentId: ID,
      id: "my-notes-separator-two",
      type: "separator",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      parentId: ID,
      id: MY_NOTES_SAVE_SELECTION_TO_REMOTE,
      title: "Save to remotely open My Notes",
      contexts: ["selection"],
    });
  });
};

let currentNotesString: string;

export const attachContextMenuOnClicked = (): void => chrome.contextMenus.onClicked.addListener((info) => {
  const menuId: string = info.menuItemId.toString();

  if (menuId === MY_NOTES_SAVE_URL_TO_CLIPBOARD) {
    Log(`Context menu is saving URL to ${CLIPBOARD_NOTE_NAME}`);

    const urlToSave = getUrlToSave(info);
    saveTextToLocalMyNotes(urlToSave, CLIPBOARD_NOTE_NAME);
    return;
  }

  if (menuId === MY_NOTES_SAVE_SELECTION_TO_CLIPBOARD) {
    Log(`Context menu is saving selection to ${CLIPBOARD_NOTE_NAME}`);

    const selectionToSave = getSelectionToSave(info);
    saveTextToLocalMyNotes(selectionToSave, CLIPBOARD_NOTE_NAME);
    return;
  }

  if (menuId.startsWith(MY_NOTES_SAVE_SELECTION_TO_NOTE_PREFIX)) {
    const destinationNoteName = menuId.replace(MY_NOTES_SAVE_SELECTION_TO_NOTE_PREFIX, "");
    Log(`Context menu is saving selection to ${destinationNoteName}`);

    const selectionToSave = getSelectionToSave(info);
    saveTextToLocalMyNotes(selectionToSave, destinationNoteName);
    return;
  }

  if (info.menuItemId === MY_NOTES_SAVE_SELECTION_TO_REMOTE) {
    Log("Context menu is saving selection to be picked up by the remotely open My Notes");

    const selectionToSave = getSelectionToSave(info);
    saveTextToRemotelyOpenMyNotes(selectionToSave);
    return;
  }
});

const recreateContextMenuFromNotes = (notes: NotesObject): void => {
  const notesString = JSON.stringify(Object.keys(notes).map((noteName) => `${noteName}_${notes[noteName].locked}`));

  // re-create context menu only when note names have changed or their "locked" property
  if (notesString === currentNotesString) {
    return;
  }

  currentNotesString = notesString;

  chrome.contextMenus.removeAll(() => {
    createContextMenu(notes);
  });
};

export const createAndUpdateContextMenuFromNotes = (): void => {
  chrome.storage.local.get("notes", (local) => {
    recreateContextMenuFromNotes(local.notes as NotesObject);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes["notes"]) {
      recreateContextMenuFromNotes(changes.notes.newValue as NotesObject);
    }
  });
};
