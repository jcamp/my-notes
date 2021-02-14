import { h, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { useCallback, useState } from "preact/hooks";
import clsx from "clsx";
import commands from "../toolbar/commands";
import InsertImageModal, { InsertImageModalProps } from "./modals/InsertImageModal";
import InsertLinkModal, { InsertLinkModalProps } from "./modals/InsertLinkModal";
import range from "../range";
import Tooltip from "./Tooltip";
import { Note } from "shared/storage/schema";
import formatDate from "shared/date/format-date";

const callback = () => {
  const event = new Event("editnote");
  document.dispatchEvent(event);
};

const titles = {
  "B": {
    mac: "Bold (⌘ + B)",
    other: "Bold (Ctrl + B)"
  },
  "I": {
    mac: "Italic (⌘ + I)",
    other: "Italic (Ctrl + I)"
  },
  "U": {
    mac: "Underline (⌘ + U)",
    other: "Underline (Ctrl + U)"
  },
  "S": {
    mac: "Strikethrough (⌘ + Shift + X)",
    other: "Strikethrough (Alt + Shift + 5)"
  },
  "RF": {
    mac: "Remove Format (⌘ + \\)",
    other: "Remove Format (Ctrl + \\)"
  },
  "UL": {
    mac: "Bulleted List (⌘ + Shift + 7)",
    other: "Bulleted List (Ctrl + Shift + 7)"
  },
  "OL": {
    mac: "Numbered List (⌘ + Shift + 8)",
    other: "Numbered List (Ctrl + Shift + 8)"
  }
} as { [key: string]: { mac: string, other: string } };

const getInfoTooltip = (note: Note) => {
  const created = formatDate(note.createdTime).split(",");
  const modified = formatDate(note.modifiedTime).split(",");

  return (
    <Fragment>
      <div>
        <div>Created:</div>
        <div>Modified:</div>
      </div>
      <div>
        <div>{created[0]}</div>
        <div>{modified[0]}</div>
      </div>
      <div>
        <div>{created[1]}</div>
        <div>{modified[1]}</div>
      </div>
    </Fragment>
  );
};

interface ToolbarProps {
  os?: "mac" | "other"
  note?: Note
}

const Toolbar = ({ os, note }: ToolbarProps): h.JSX.Element => {
  const getTitle = useCallback((key: string) => (os && titles[key][os]) || "(undefined)", [os]);
  const [submenu, setSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (event: MouseEvent): void => {
    if (event.target === event.currentTarget) {
      const submenuToToggle = (event.target as HTMLDivElement).id;
      setSubmenu((prev) => prev === submenuToToggle ? null : submenuToToggle);
    }
  };

  const [insertImageModalProps, setInsertImageModalProps] = useState<InsertImageModalProps | null>(null);
  const [insertLinkModalProps, setInsertLinkModalProps] = useState<InsertLinkModalProps | null>(null);

  return (
    <Fragment>
      <div id="toolbar" class="bar">
        <Tooltip tooltip={getTitle("B")}>
          <div id="B" class="button" onClick={commands.bold}>
            <svg viewBox="0 0 181.395 181.395">
              <path d="m20.618,181.395v-181.395h62.293c22.506,0 40.074,4.174 52.699,12.521 12.623,8.346 18.936,20.785 18.936,37.313 0,8.639-2.033,16.318-6.104,23.049-4.07,6.729-10.34,11.795-18.813,15.199 10.631,2.408 18.479,7.246 23.547,14.514 5.064,7.268 7.6,15.637 7.6,25.104 0,17.691-5.939,31.064-17.814,40.115-11.879,9.055-28.904,13.58-51.082,13.58h-71.262zm42.235-105.772h20.93c9.551-0.166 16.695-2.014 21.43-5.545 4.734-3.529 7.102-8.699 7.102-15.51 0-7.725-2.41-13.35-7.225-16.881-4.82-3.529-12.211-5.295-22.178-5.295h-20.059v43.231zm0,27.908v45.473h29.027c8.971,0 15.699-1.766 20.184-5.297 4.484-3.529 6.729-8.947 6.729-16.256 0-7.891-1.932-13.85-5.795-17.879-3.861-4.027-10.111-6.041-18.748-6.041h-31.397z" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("I")}>
          <div id="I" class="button" onClick={commands.italic}>
            <svg viewBox="0 0 181.5 181.5">
              <path d="M93.368,181.5H51.856L88.132,0h41.512L93.368,181.5z" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("U")}>
          <div id="U" class="button" onClick={commands.underline}>
            <svg viewBox="0 0 230 230">
              <path d="M61.638,164.165C75.236,175.39,93.257,181,115.458,181c21.955,0,39.679-5.61,53.239-16.835 C182.254,152.942,189,137.13,189,116.731V0h-42v116.731c0,11.06-2.501,19.212-8.03,24.454c-5.529,5.244-13.284,7.864-23.524,7.864 c-10.322,0-18.312-2.642-23.965-7.926C85.829,135.841,83,127.711,83,116.731V0H41v116.731C41,137.13,48.039,152.942,61.638,164.165z" />
              <rect width="230" y="197" height="33" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("S")}>
          <div id="S" class="button wide" onClick={commands.strikeThrough}>
            <svg viewBox="0 0 230 230">
              <polygon points="230,99 136,99 136,57 183,57 183,25 47,25 47,57 94,57 94,99 0,99 0,132 94,132 94,205 136,205 136,132 230,132 " />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Heading">
          <div id="H" class={clsx("button", submenu === "H" && "active")} onClick={toggleSubmenu}>
            <svg viewBox="0 0 220.068 220.068">
              <path d="M136.922,51.991H89.297v148.332H47.253V51.991H0V19.745h136.922V51.991z" />
              <path d="M220.068,98.245h-38.463v102.078h-38.236V98.245h-37.899V68.919h114.598V98.245z" />
            </svg>
            <div class="menu bar">
              <Tooltip tooltip="Heading 1">
                <div id="H1" class="button" onClick={commands.h1}>H<span>1</span></div>
              </Tooltip>
              <Tooltip tooltip="Heading 2">
                <div id="H2" class="button" onClick={commands.h2}>H<span>2</span></div>
              </Tooltip>
              <Tooltip tooltip="Heading 3">
                <div id="H3" class="button" onClick={commands.h3}>H<span>3</span></div>
              </Tooltip>
            </div>
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("UL")}>
          <div id="UL" class="button" onClick={commands.ul}>
            <svg viewBox="0 0 394.971 394.971">
              <circle cx="56.424" cy="197.486" r="51.2" />
              <path d="M379.298,187.037H143.151c-5.771,0-10.449,4.678-10.449,10.449s4.678,10.449,10.449,10.449h236.147
                c5.771,0,10.449-4.678,10.449-10.449S385.069,187.037,379.298,187.037z"/>
              <circle cx="56.424" cy="51.2" r="51.2" />
              <path d="M143.151,61.649h236.147c5.771,0,10.449-4.678,10.449-10.449s-4.678-10.449-10.449-10.449H143.151
                c-5.771,0-10.449,4.678-10.449,10.449S137.38,61.649,143.151,61.649z"/>
              <circle cx="56.424" cy="343.771" r="51.2" />
              <path d="M379.298,333.322H143.151c-5.771,0-10.449,4.678-10.449,10.449s4.678,10.449,10.449,10.449h236.147
                c5.771,0,10.449-4.678,10.449-10.449S385.069,333.322,379.298,333.322z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("OL")}>
          <div id="OL" class="button" onClick={commands.ol}>
            <svg viewBox="0 0 512.003 512.003">
              <path d="M155.003 90.001h342c8.284 0 15-6.716 15-15s-6.716-15-15-15h-342c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
              <path d="M497.003 241.001h-342c-8.284 0-15 6.716-15 15s6.716 15 15 15h342c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
              <path d="M497.003 422.001h-342c-8.284 0-15 6.716-15 15s6.716 15 15 15h342c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
              <path d="M26.003 30.001h8.512v95c0 8.284 6.716 15 15 15s15-6.716 15-15v-110c0-8.284-6.716-15-15-15h-23.512c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
              <path d="M74.083 295.753c-8.847.111-18.162.192-26.478.228 5.659-7.649 13.006-17.786 22.378-31.176 7.1-10.143 11.74-19.777 13.794-28.635.114-.491.203-.987.267-1.487l.533-4.173c.081-.63.121-1.265.121-1.901 0-23.494-19.113-42.607-42.606-42.607-20.314 0-37.897 14.453-41.808 34.365-1.597 8.129 3.699 16.013 11.828 17.609 8.13 1.595 16.013-3.699 17.609-11.828 1.154-5.879 6.357-10.146 12.37-10.146 6.692 0 12.183 5.242 12.583 11.835l-.281 2.203c-.932 3.577-3.26 9.377-8.988 17.563-17.055 24.369-27.23 37.691-32.696 44.849-6.906 9.042-10.71 14.023-8.206 22.166 1.492 4.849 5.153 8.565 10.048 10.196 2.03.677 3.657 1.219 24.6 1.219 8.314 0 19.673-.085 35.31-.282 8.283-.104 14.914-6.904 14.811-15.188-.106-8.283-6.918-14.902-15.189-14.81z" />
              <path d="M44.637 372.001c-20.264 0-37.802 14.417-41.702 34.28-1.597 8.129 3.699 16.013 11.828 17.609 8.13 1.595 16.013-3.699 17.609-11.829 1.145-5.829 6.303-10.06 12.265-10.06 6.893 0 12.5 5.607 12.5 12.5s-5.607 12.5-12.5 12.5c-8.284 0-15 6.716-15 15s6.716 15 15 15c6.893 0 12.5 5.607 12.5 12.5s-5.607 12.5-12.5 12.5c-6.202 0-11.524-4.616-12.378-10.736-.081-.58-.122-1.173-.122-1.764 0-8.284-6.716-15-15-15s-15 6.716-15 15c0 1.972.138 3.959.409 5.909 2.911 20.86 21.007 36.591 42.091 36.591 23.435 0 42.5-19.065 42.5-42.5 0-10.481-3.822-20.082-10.134-27.5 6.313-7.418 10.134-17.019 10.134-27.5 0-23.434-19.066-42.5-42.5-42.5z" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Outdent">
          <div id="OUTDENT" class="button" onClick={commands.outdent}>
            <svg viewBox="0 0 24 24">
              <path d="m21 3h-20c-.552 0-1-.448-1-1s.448-1 1-1h20c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m11 8h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m11 13h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m11 18h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m21 23h-20c-.552 0-1-.448-1-1s.448-1 1-1h20c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m14.239 11.45 3.5-3.25c.219-.203.537-.255.811-.138.273.119.45.389.45.688v2.25h3c.553 0 1 .448 1 1s-.447 1-1 1h-3v2.25c0 .298-.177.568-.45.688-.097.041-.198.062-.3.062-.186 0-.369-.069-.511-.2l-3.5-3.25c-.152-.143-.239-.342-.239-.55s.087-.408.239-.55z" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Indent">
          <div id="INDENT" class="button" onClick={commands.indent}>
            <svg viewBox="0 0 24 24">
              <path d="m22 3h-20c-.552 0-1-.448-1-1s.448-1 1-1h20c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m22 8h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m22 13h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m22 18h-10c-.552 0-1-.448-1-1s.448-1 1-1h10c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m22 23h-20c-.552 0-1-.448-1-1s.448-1 1-1h20c.552 0 1 .448 1 1s-.448 1-1 1z" />
              <path d="m8.761 11.45-3.5-3.25c-.219-.203-.537-.255-.811-.138-.273.119-.45.389-.45.688v2.25h-3c-.553 0-1 .448-1 1s.447 1 1 1h3v2.25c0 .298.177.568.45.688.097.041.198.062.3.062.186 0 .369-.069.511-.2l3.5-3.25c.152-.143.239-.342.239-.55s-.087-.408-.239-.55z" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Align Left">
          <div id="CL" class="button" onClick={commands.left}>
            <svg viewBox="0 0 397.061 397.061">
              <rect x="109.714" y="94.041" width="240.327" height="73.143" />
              <rect x="109.714" y="229.878" width="167.184" height="73.143" />
              <path d="M57.469,0C51.699,0,47.02,4.678,47.02,10.449v376.163c0,5.771,4.678,10.449,10.449,10.449s10.449-4.678,10.449-10.449
                V10.449C67.918,4.678,63.24,0,57.469,0z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Align Center">
          <div id="CC" class="button" onClick={commands.center}>
            <svg viewBox="0 0 397.061 397.061">
              <rect x="78.367" y="94.041" width="104.49" height="73.143" />
              <rect x="214.204" y="94.041" width="104.49" height="73.143" />
              <rect x="214.204" y="229.878" width="67.918" height="73.143" />
              <rect x="114.939" y="229.878" width="67.918" height="73.143" />
              <path d="M198.531,0c-5.771,0-10.449,4.678-10.449,10.449v376.163c0,5.771,4.678,10.449,10.449,10.449s10.449-4.678,10.449-10.449
                V10.449C208.98,4.678,204.301,0,198.531,0z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Align Right">
          <div id="CR" class="button" onClick={commands.right}>
            <svg viewBox="0 0 397.061 397.061">
              <rect x="47.02" y="94.041" width="240.327" height="73.143" />
              <rect x="120.163" y="229.878" width="167.184" height="73.143" />
              <path d="M339.592,0c-5.771,0-10.449,4.678-10.449,10.449v376.163c0,5.771,4.678,10.449,10.449,10.449s10.449-4.678,10.449-10.449
                V10.449C350.041,4.678,345.363,0,339.592,0z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Insert Image">
          <div id="IMG" class="button" onClick={() => {
            range.save();
            setInsertImageModalProps({
              onCancel: () => setInsertImageModalProps(null),
              onConfirm: (src) => {
                setInsertImageModalProps(null);
                setTimeout(() => {
                  range.restore();
                  commands.insertImage(src);
                }, 0);
              }
            });
          }}>
            <svg viewBox="0 -47 425.968 425">
              <path d="m166.960938 56.484375c-26.34375 0-47.699219 21.355469-47.699219 47.699219s21.355469 47.699218 47.699219 47.699218 47.699218-21.355468 47.699218-47.699218c-.027344-26.332032-21.367187-47.667969-47.699218-47.699219zm0 0" />
              <path d="m395.96875.484375h-365.96875c-16.5625.019531-29.9804688 13.4375-30 30v224.019531l69.699219-46.417968c16.796875-11.109376 38.621093-11.039063 55.347656.179687l50.910156 34.070313c13.351563 8.980468 31.40625 5.796874 40.886719-7.199219l68.101562-92.980469c9.507813-12.980469 24.683594-20.59375 40.777344-20.453125 16.089844.140625 31.132813 8.019531 40.410156 21.167969l59.832032 84.773437v-197.160156c-.019532-16.558594-13.4375-29.980469-29.996094-30zm-229.007812 171.40625c-37.386719 0-67.699219-30.308594-67.699219-67.699219s30.3125-67.699218 67.699219-67.699218c37.390624 0 67.699218 30.308593 67.699218 67.699218-.042968 37.371094-30.328125 67.65625-67.699218 67.699219zm0 0" />
              <path d="m325.550781 141.699219c-9.671875-.148438-18.804687 4.429687-24.464843 12.269531l-68.101563 92.980469c-15.796875 21.664062-45.894531 26.96875-68.144531 12.007812l-50.917969-34.074219c-10.023437-6.726562-23.105469-6.777343-33.179687-.125l-80.742188 53.773438v21.953125c.0195312 16.558594 13.4375 29.980469 30 30h365.96875c16.558594-.019531 29.980469-13.441406 30-30v-38.160156l-76.171875-107.925781c-5.53125-7.929688-14.578125-12.667969-24.246094-12.699219zm0 0" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Insert Link">
          <div id="LINK" class="button" onClick={() => {
            range.save();
            setInsertLinkModalProps({
              onCancel: () => setInsertLinkModalProps(null),
              onConfirm: (href) => {
                setInsertLinkModalProps(null);
                setTimeout(() => {
                  range.restore();
                  commands.insertLink(href);
                }, 0);
              }
            });
          }}>
            <svg viewBox="0 0 512 512">
              <path d="M474.562,37.446c-49.928-49.928-131.135-49.928-181.063,0L220.2,110.744c-3.115,3.115-3.991,7.825-2.219,11.846
                c1.771,4.032,5.522,6.616,10.252,6.356l3.251-0.24c5.533-0.51,11.19-0.094,16.785,0.427c9.388,0.854,19.223,2.844,30.08,6.074
                c3.772,1.156,7.825,0.094,10.586-2.678l49.824-49.824c24.172-24.172,66.37-24.172,90.542,0c24.964,24.964,24.964,65.577,0,90.541
                l-71.375,71.374c-5.617-22.019-16.668-41.752-32.733-57.809c-21.026-21.036-48.293-33.633-78.852-36.435
                c-26.527-2.313-52.669,3.303-75.559,16.525c-10.93,6.335-19.4,12.659-26.652,19.911L37.438,293.503
                c-49.918,49.917-49.918,131.144,0,181.061C62.403,499.528,95.181,512,127.97,512c32.789,0,65.567-12.472,90.532-37.435
                l73.278-73.277c3.105-3.105,3.991-7.793,2.23-11.815c-1.761-4.022-5.97-6.731-10.18-6.387l-3.386,0.24
                c-5.449,0.531-11.096,0.052-16.712-0.458c-9.367-0.854-19.213-2.844-30.09-6.074c-3.793-1.136-7.814-0.094-10.575,2.688
                l-49.824,49.824c-24.172,24.172-66.37,24.172-90.542,0c-24.964-24.964-24.964-65.577,0-90.541l71.375-71.374
                c5.617,22.019,16.668,41.752,32.733,57.808c21.036,21.036,48.303,33.633,78.862,36.425c3.98,0.365,7.95,0.542,11.909,0.542
                c22.391,0,44.187-5.814,63.64-17.056c10.93-6.335,19.4-12.659,26.652-19.911l106.692-106.691
                C524.479,168.59,524.479,87.363,474.562,37.446z M295.679,295.709c-23.009,6.991-47.184,0.646-63.611-15.772
                c-16.656-16.656-22.488-41.152-15.75-63.626c23.051-6.956,47.205-0.639,63.615,15.761
                C296.592,248.731,302.421,273.232,295.679,295.709z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Code Block">
          <div id="PRE" class="button" onClick={commands.pre}>
            <svg viewBox="0 0 92.812 92.812">
              <path d="M92.226,44.992L60.971,13.736c-0.781-0.781-2.048-0.781-2.828,0l-6.729,6.728c-0.375,0.375-0.586,0.884-0.586,1.414
                c0,0.53,0.211,1.039,0.586,1.414l23.115,23.114L51.416,69.521c-0.375,0.375-0.586,0.884-0.586,1.414s0.211,1.04,0.586,1.415
                l6.73,6.728c0.391,0.39,0.902,0.585,1.414,0.585s1.024-0.195,1.415-0.586L92.227,47.82C93.008,47.039,93.008,45.773,92.226,44.992z"/>
              <path d="M18.283,46.406l23.114-23.114c0.375-0.375,0.586-0.884,0.586-1.414c0-0.53-0.211-1.039-0.586-1.414l-6.728-6.728
                c-0.781-0.781-2.048-0.781-2.828,0L0.586,44.992C0.211,45.367,0,45.876,0,46.406s0.211,1.039,0.586,1.414l31.26,31.256
                c0.375,0.375,0.884,0.586,1.415,0.586c0.53,0,1.039-0.211,1.414-0.586l6.724-6.728c0.781-0.781,0.781-2.049,0-2.828L18.283,46.406z"/>
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip="Table">
          <div id="TABLE" class={clsx("button", submenu === "TABLE" && "active")} onClick={toggleSubmenu}>
            <svg viewBox="0 0 384 384">
              <path d="M0,0v384h384V0H0z M170.667,341.333h-128v-128h128V341.333z M170.667,170.667h-128v-128h128V170.667z M341.333,341.333
                h-128v-128h128V341.333z M341.333,170.667h-128v-128h128V170.667z"/>
            </svg>
            <div class="menu bar">
              <Tooltip tooltip="Insert table (3x3)">
                <div id="TABLE_INSERT" class="button wide" onClick={() => commands.table.insertTable(callback)}>
                  <svg viewBox="0 0 384 384">
                    <path d="M0,0v384h384V0H0z M170.667,341.333h-128v-128h128V341.333z M170.667,170.667h-128v-128h128V170.667z M341.333,341.333
                      h-128v-128h128V341.333z M341.333,170.667h-128v-128h128V170.667z"/>
                  </svg>
                </div>
              </Tooltip>
              <Tooltip tooltip="Insert row above">
                <div id="TABLE_ROW_ABOVE" class="button" onClick={() => commands.table.insertRowAbove(callback)}>
                  <svg viewBox="0 -21 512 512">
                    <path d="m102.355469 170.410156-74.664063-80c-4.480468-4.820312-11.414062-6.421875-17.558594-3.96875-6.121093 2.410156-10.132812 8.320313-10.132812 14.890625v160c0 6.570313 4.011719 12.480469 10.132812 14.871094 1.898438.765625 3.882813 1.128906 5.867188 1.128906 4.351562 0 8.597656-1.769531 11.691406-5.074219l74.664063-80c5.742187-6.144531 5.742187-15.703124 0-21.847656zm0 0" />
                    <path d="m469.332031 0h-320c-23.53125 0-42.664062 19.136719-42.664062 42.667969v42.664062c0 23.53125 19.132812 42.667969 42.664062 42.667969h320c23.53125 0 42.667969-19.136719 42.667969-42.667969v-42.664062c0-23.53125-19.136719-42.667969-42.667969-42.667969zm-320 42.667969h138.667969v42.664062h-138.667969zm181.335938 42.664062v-42.664062h138.664062l.023438 42.664062zm0 0" />
                    <path d="m469.332031 234.667969h-320c-23.53125 0-42.664062 19.132812-42.664062 42.664062v149.335938c0 23.53125 19.132812 42.664062 42.664062 42.664062h320c23.53125 0 42.667969-19.132812 42.667969-42.664062v-149.335938c0-23.53125-19.136719-42.664062-42.667969-42.664062zm0 96h-138.664062v-53.335938h138.664062zm-181.332031-53.335938v53.335938h-138.667969v-53.335938zm-138.667969 96h138.667969v53.335938h-138.667969zm181.335938 53.335938v-53.335938h138.6875v53.335938zm0 0" />
                  </svg>
                </div>
              </Tooltip>
              <Tooltip tooltip="Insert row below">
                <div id="TABLE_ROW_BELOW" class="button" onClick={() => commands.table.insertRowBelow(callback)}>
                  <svg viewBox="0 -21 512 512">
                    <path d="m102.355469 277.078125-74.664063-80c-4.480468-4.820313-11.414062-6.421875-17.558594-3.96875-6.121093 2.410156-10.132812 8.320313-10.132812 14.890625v160c0 6.570312 4.011719 12.480469 10.132812 14.871094 1.898438.765625 3.882813 1.128906 5.867188 1.128906 4.351562 0 8.597656-1.769531 11.691406-5.078125l74.664063-80c5.742187-6.144531 5.742187-15.699219 0-21.84375zm0 0" />
                    <path d="m469.332031 341.332031h-320c-23.53125 0-42.664062 19.136719-42.664062 42.667969v42.667969c0 23.53125 19.132812 42.664062 42.664062 42.664062h320c23.53125 0 42.667969-19.132812 42.667969-42.664062v-42.667969c0-23.53125-19.136719-42.667969-42.667969-42.667969zm-320.019531 42.667969h138.6875v42.667969h-138.667969zm320.019531 42.667969h-138.664062v-42.667969h138.664062zm0 0" />
                    <path d="m469.332031 0h-320c-23.53125 0-42.664062 19.136719-42.664062 42.667969v149.332031c0 23.53125 19.132812 42.667969 42.664062 42.667969h320c23.53125 0 42.667969-19.136719 42.667969-42.667969v-149.332031c0-23.53125-19.136719-42.667969-42.667969-42.667969zm0 96h-138.664062v-53.332031h138.664062zm-320-53.332031h138.667969v53.332031h-138.6875zm0 96h138.667969v53.332031h-138.667969zm181.335938 53.332031v-53.332031h138.664062v53.332031zm0 0" />
                  </svg>
                </div>
              </Tooltip>
              <Tooltip tooltip="Insert column left">
                <div id="TABLE_COLUMN_LEFT" class="button" onClick={() => commands.table.insertColumnLeft(callback)}>
                  <svg viewBox="-21 0 512 512">
                    <path d="m276.203125 10.132812c-2.390625-6.121093-8.300781-10.132812-14.871094-10.132812h-160c-6.570312 0-12.480469 4.011719-14.867187 10.132812-2.410156 6.125-.855469 13.078126 3.96875 17.558594l80 74.664063c3.070312 2.882812 6.972656 4.3125 10.898437 4.3125s7.832031-1.429688 10.925781-4.3125l80-74.664063c4.796876-4.480468 6.375-11.433594 3.945313-17.558594zm0 0" />
                    <path d="m85.332031 106.667969h-42.664062c-23.53125 0-42.667969 19.132812-42.667969 42.664062v320c0 23.53125 19.136719 42.667969 42.667969 42.667969h42.664062c23.53125 0 42.667969-19.136719 42.667969-42.667969v-320c0-23.53125-19.136719-42.664062-42.667969-42.664062zm0 42.644531v138.6875h-42.664062v-138.667969zm-42.664062 320.019531v-138.664062h42.664062v138.664062zm0 0" />
                    <path d="m426.667969 106.667969h-149.335938c-23.53125 0-42.664062 19.132812-42.664062 42.664062v320c0 23.53125 19.132812 42.667969 42.664062 42.667969h149.335938c23.53125 0 42.664062-19.136719 42.664062-42.667969v-320c0-23.53125-19.132812-42.664062-42.664062-42.664062zm0 181.332031h-53.335938v-138.6875h53.335938zm-96-138.6875v138.6875h-53.335938v-138.667969zm-53.335938 181.355469h53.335938v138.664062h-53.335938zm96 138.664062v-138.664062h53.335938v138.664062zm0 0" />
                  </svg>
                </div>
              </Tooltip>
              <Tooltip tooltip="Insert column right">
                <div id="TABLE_COLUMN_RIGHT" class="button wide" onClick={() => commands.table.insertColumnRight(callback)}>
                  <svg viewBox="-21 0 512 512">
                    <path d="m382.890625 10.132812c-2.410156-6.121093-8.320313-10.132812-14.890625-10.132812h-160c-6.570312 0-12.480469 4.011719-14.890625 10.132812-2.410156 6.125-.832031 13.078126 3.96875 17.558594l80 74.664063c3.070313 2.882812 6.996094 4.3125 10.921875 4.3125s7.851562-1.429688 10.921875-4.3125l80-74.664063c4.800781-4.480468 6.378906-11.433594 3.96875-17.558594zm0 0" />
                    <path d="m426.667969 106.667969h-42.667969c-23.53125 0-42.667969 19.132812-42.667969 42.664062v320c0 23.53125 19.136719 42.667969 42.667969 42.667969h42.667969c23.53125 0 42.664062-19.136719 42.664062-42.667969v-320c0-23.53125-19.132812-42.664062-42.664062-42.664062zm0 42.664062v138.667969h-42.667969v-138.667969zm-42.667969 320.023438v-138.6875h42.667969v138.664062zm0 0" />
                    <path d="m192 106.667969h-149.332031c-23.53125 0-42.667969 19.132812-42.667969 42.664062v320c0 23.53125 19.136719 42.667969 42.667969 42.667969h149.332031c23.53125 0 42.667969-19.136719 42.667969-42.667969v-320c0-23.53125-19.136719-42.664062-42.667969-42.664062zm0 181.332031h-53.332031v-138.667969h53.332031zm-96-138.667969v138.667969h-53.332031v-138.667969zm-53.332031 181.335938h53.332031v138.6875h-53.332031zm96 138.664062v-138.664062h53.332031v138.664062zm0 0" />
                  </svg>
                </div>
              </Tooltip>
              <Tooltip tooltip="Toggle heading row">
                <div id="TABLE_HEADING_ROW" class="button" onClick={() => commands.table.toggleHeadingRow(callback)}>
                  <svg viewBox="0 0 485.064 485.064">
                    <path d="M458.736,181.097H26.334C11.793,181.097,0,192.884,0,207.425v70.215c0,14.541,11.787,26.328,26.334,26.328h432.402
                      c14.541,0,26.328-11.787,26.328-26.328v-70.215C485.07,192.884,473.283,181.097,458.736,181.097z"/>
                  </svg>
                </div>
              </Tooltip>
              <Tooltip tooltip="Toggle heading column">
                <div id="TABLE_HEADING_COLUMN" class="button wide rotate90" onClick={() => commands.table.toggleHeadingColumn(callback)}>
                  <svg viewBox="0 0 485.064 485.064">
                    <path d="M458.736,181.097H26.334C11.793,181.097,0,192.884,0,207.425v70.215c0,14.541,11.787,26.328,26.334,26.328h432.402
                      c14.541,0,26.328-11.787,26.328-26.328v-70.215C485.07,192.884,473.283,181.097,458.736,181.097z"/>
                  </svg>
                </div>
              </Tooltip>
              <Tooltip tooltip="Delete row">
                <div id="TABLE_DELETE_ROW" class="button" onClick={() => commands.table.deleteRow(callback)}>
                  <svg viewBox="0 0 15.381 15.381">
                    <path d="M0,1.732v7.732h6.053c0-0.035-0.004-0.07-0.004-0.104c0-0.434,0.061-0.854,0.165-1.255H1.36V3.092
                      h12.662v2.192c0.546,0.396,1.01,0.897,1.359,1.477V1.732H0z"/>
                    <path d="M11.196,5.28c-2.307,0-4.183,1.877-4.183,4.184c0,2.308,1.876,4.185,4.183,4.185
                      c2.309,0,4.185-1.877,4.185-4.185C15.381,7.157,13.505,5.28,11.196,5.28z M11.196,12.513c-1.679,0-3.047-1.367-3.047-3.049
                      c0-1.68,1.368-3.049,3.047-3.049c1.684,0,3.05,1.369,3.05,3.049C14.246,11.146,12.88,12.513,11.196,12.513z"/>
                    <rect x="9.312" y="8.759" width="3.844" height="1.104" />
                  </svg>
                </div>
              </Tooltip>
              <Tooltip tooltip="Delete column">
                <div id="TABLE_DELETE_COLUMN" class="button" onClick={() => commands.table.deleteColumn(callback)}>
                  <svg viewBox="0 0 26 26">
                    <path d="M13.594,20.85V24h-10V2h10v3.15c0.633-0.323,1.304-0.565,2-0.727V1c0-0.551-0.448-1-1-1h-12
                      c-0.55,0-1,0.449-1,1v24c0,0.551,0.449,1,1,1h12c0.552,0,1-0.449,1-1v-3.424C14.898,21.415,14.227,21.173,13.594,20.85z"/>
                    <path d="M17.594,6.188c-3.762,0-6.813,3.051-6.812,6.813c-0.001,3.761,3.05,6.812,6.812,6.812
                      s6.813-3.051,6.813-6.813S21.355,6.188,17.594,6.188z M21.226,13.99l-7.267,0.001v-1.982h7.268L21.226,13.99z"/>
                  </svg>
                </div>
              </Tooltip>
            </div>
          </div>
        </Tooltip>

        <Tooltip tooltip="Highlight">
          <div id="HIGH" class="button" onClick={() => commands.highlight(callback)}>
            <svg viewBox="0 0 512 512">
              <polygon points="338.231,77.679 153.163,232.022 299.779,378.637 454.122,193.57" />
              <polygon points="407.634,19.801 361.366,58.387 473.414,170.435 512,124.168" />
              <path d="M134.863,256.148c-11.814,34.634-30.789,65.513-56.885,91.608l-10.606,10.607l106.066,106.066l10.607-10.607
                c25.95-25.95,56.838-44.91,91.619-56.873L134.863,256.148z"/>
              <polygon points="67.372,400.789 0,460.379 96.46,492.199 131.012,464.429" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip tooltip={getTitle("RF")}>
          <div id="RF" class="button" onClick={commands.removeFormat}>
            <svg viewBox="0 0 384 384">
              <polygon points="27.093,21.333 0,48.533 148.693,197.227 96,320 160,320 193.493,241.92 314.24,362.667 341.333,335.467 32.96,27.2" />
              <polygon points="85.333,21.333 85.333,25.173 145.493,85.333 196.587,85.333 181.227,121.067 226.027,165.867 260.587,85.333 384,85.333 384,21.333" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip className="info-tooltip" tooltip={note ? getInfoTooltip(note) : ""}>
          <div id="INFO" class="button last">
            <svg viewBox="0 0 111.577 111.577">
              <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451
                c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064
                c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848
                c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71
                c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667
                c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747
                c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815
                c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744
                C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796
                c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207
                C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z"/>
            </svg>
          </div>
        </Tooltip>
      </div>

      {insertImageModalProps && (
        <InsertImageModal {...insertImageModalProps} />
      )}

      {insertLinkModalProps && (
        <InsertLinkModal {...insertLinkModalProps} />
      )}
    </Fragment>
  );
};

export default Toolbar;
