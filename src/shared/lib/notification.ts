import { notifications, NotificationProps } from "@mantine/notifications";
import { attach, createEffect, createEvent, sample } from "effector";

export type NotifyOptions = Pick<NotificationProps, "title" | "message">;

const notifyFx = createEffect<NotificationProps, void>((props) => {
  notifications.show({ withBorder: true, ...props });
});

const notifySuccessFx = attach({
  effect: notifyFx,
  mapParams: (options: NotifyOptions): NotificationProps => ({
    ...options,
    color: "green",
  }),
});

const notifyInfoFx = attach({
  effect: notifyFx,
  mapParams: (options: NotifyOptions): NotificationProps => ({
    ...options,
    color: "blue",
  }),
});

const notifyErrorFx = attach({
  effect: notifyFx,
  mapParams: (options: NotifyOptions): NotificationProps => ({
    ...options,
    color: "red",
  }),
});

const successNotified = createEvent<NotifyOptions>();
const infoNotified = createEvent<NotifyOptions>();
const errorNotified = createEvent<NotifyOptions>();

export const notification = { successNotified, infoNotified, errorNotified };

sample({ clock: successNotified, target: notifySuccessFx });
sample({ clock: infoNotified, target: notifyInfoFx });
sample({ clock: errorNotified, target: notifyErrorFx });
