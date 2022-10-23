export type Os = "mac" | "other";

export interface Note {
  content: string
  createdTime: string
  modifiedTime: string
  sync?: {
    file: GoogleDriveFile
  }
  locked?: boolean
  pinnedTime?: string
  raw?: boolean
}

export interface RegularFont {
  id: string
  name: string
  genericFamily: string
  fontFamily: string
}

export interface GoogleFont {
  id: string
  name: string
  fontFamily: string
  href: string
}

export type Theme = "light" | "dark" | "custom";

export enum NotificationType {
  NEW_VERSION,
}

export interface Notification {
  type: NotificationType
  payload: string
}

export interface Sync {
  folderId: string
  folderLocation: string
  assetsFolderId: string
  lastSync?: string
}

export interface GoogleDriveFile {
  id: string
  name: string
  createdTime: string
  modifiedTime: string
  content?: string
}

export interface SyncLookup extends Sync {
  files: GoogleDriveFile[]
}

export type NotesObject = {
  [key: string]: Note
};

export enum NotesOrder {
  Alphabetical = "Alphabetical",
  LatestCreated = "LatestCreated",
  LatestModified = "LatestModified",
  Custom = "Custom",
}

export interface Storage {
  // Notifications
  notification?: Notification

  // Appearance
  font: RegularFont | GoogleFont
  size: number
  sidebar: boolean
  sidebarWidth?: string
  toolbar: boolean
  theme: Theme
  customTheme: string

  // Notes
  notes: NotesObject
  order: string[]
  active: string | null
  setBy: string     // e.g. "worker-[ISOString]", "[tabId]-[ISOString]"
  lastEdit: string  // e.g. "[ISOString]"

  // Options
  notesOrder: NotesOrder
  focus: boolean
  tab: boolean
  tabSize: number
  openNoteOnMouseHover: boolean

  // Sync
  sync?: Sync // Google Drive Sync
  autoSync: boolean
}

export type StorageKey = keyof Storage;

export interface ContextMenuSelection {
  text: string
  sender: string
}

export enum MessageType {
  SYNC_INITIATE,
  SYNC,
  SYNC_FAIL,
  SYNC_START,
  SYNC_DONE,
  SYNC_STOP,
  SYNC_DELETE_FILE,
  DROP,
}

export interface Message {
  type: MessageType
  payload?: unknown
}
