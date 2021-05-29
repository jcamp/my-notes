import { h, render, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from "preact/hooks";

import __Font from "options/Font";
import __Size from "options/Size";
import __Theme from "options/Theme";
import __KeyboardShortcuts from "options/KeyboardShortcuts";
import __Options from "options/Options";
import __Version from "options/Version";

import {
  RegularFont,
  GoogleFont,
  Theme,
  Sync,
} from "shared/storage/schema";
import { setTheme as setThemeCore } from "themes/set-theme";

const Options = () => {
  const [version] = useState<string>(chrome.runtime.getManifest().version);
  const [font, setFont] = useState<RegularFont | GoogleFont | undefined>(undefined);
  const [size, setSize] = useState<number>(0);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [customTheme, setCustomTheme] = useState<string>("");
  const [sync, setSync] = useState<Sync | undefined>(undefined);
  const [tab, setTab] = useState<boolean>(false);
  const [tabSize, setTabSize] = useState<number>(-1);

  useEffect(() => {
    chrome.storage.local.get([
      "font",
      "size",
      "theme",
      "customTheme",
      "sync",
      "tab",
      "tabSize",
    ], local => {
      setFont(local.font);
      setSize(local.size);
      setTheme(local.theme);
      setCustomTheme(local.customTheme);
      setSync(local.sync);
      setTab(local.tab);
      setTabSize(local.tabSize);
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") {
        return;
      }

      if (changes["font"]) {
        setFont(changes["font"].newValue);
      }

      if (changes["size"]) {
        setSize(changes["size"].newValue);
      }

      if (changes["theme"]) {
        setTheme(changes["theme"].newValue);
      }

      if (changes["customTheme"]) {
        setCustomTheme(changes["customTheme"].newValue);
      }

      if (changes["sync"]) {
        setSync(changes["sync"].newValue);
      }

      if (changes["tab"]) {
        setTab(changes["tab"].newValue);
      }

      if (changes["tabSize"]) {
        setTabSize(changes["tabSize"].newValue);
      }
    });
  }, []);

  useEffect(() => {
    // setThemeCore injects one of:
    // - light.css
    // - dark.css
    // - customTheme string
    theme && setThemeCore(document, { theme, customTheme: customTheme });
  }, [theme, customTheme]);

  return (
    <Fragment>
      <h1>My Notes</h1>

      <__Font font={font} />
      <__Size size={size} />
      <__Theme theme={theme} />
      <__KeyboardShortcuts />
      <__Options
        sync={sync}
        tab={tab}
        tabSize={tabSize}
      />
      <__Version version={version} />
    </Fragment>
  );
};

render(<Options />, document.body);
