import { h, Fragment } from "preact"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Notification, NotificationType } from "shared/storage/schema";

interface NotificationProps {
  notification: Notification
  onClose: () => void
}

const Notification = ({ notification, onClose }: NotificationProps): h.JSX.Element => (
  <div class="notification">
    {notification.type === NotificationType.NEW_VERSION && (
      <Fragment>
        <div>New version <span class="version">{notification.payload}</span> installed.</div>
        <div>
          <a href="https://github.com/penge/my-notes/releases" target="_blank">What's new</a><span>,&nbsp;</span>
          <a href="#" onClick={(event) => {
            event.preventDefault();
            onClose();
          }}>Close</a>
        </div>
      </Fragment>
    )}
  </div>
);

export default Notification;
