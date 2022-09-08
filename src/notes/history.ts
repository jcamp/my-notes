import { isOverview } from "./location";

type NoteNameFunc = (noteName: string) => void;

// Use replace when a note is renamed or deleted
const replace: NoteNameFunc = (noteName: string): void =>
  window.history.replaceState({ noteName }, noteName, `?note=${noteName}`);

// Use push when a note is created
const push: NoteNameFunc = (noteName: string): void =>
  window.history.pushState({ noteName }, noteName, `?note=${noteName}`);

let attached = false;
const attach = (onPop: NoteNameFunc): void => {
  if (attached) {
    return;
  }

  window.onpopstate = (event: PopStateEvent) => {
    const noteName = event.state && event.state.noteName;
    if (noteName) {
      onPop(noteName);
    }
  };

  attached = true;
};

const canProxy = () => !isOverview();

export default {
  replace: (noteName: string) => canProxy() && replace(noteName),
  push: (noteName: string) => canProxy() && push(noteName),
  attach: (onPop: NoteNameFunc) => canProxy() && attach(onPop),
};
