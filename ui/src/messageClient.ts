import { CloseCommand, ExportBorderlessCommand, ExportCommand, ShowUICommand } from '../../shared/types';
import { removeBorder } from './image';
import { setFilename } from './state';
import { zip } from './zip';

export const createMessageClient = ({
  window,
  forward,
}: {
  window: Window;
  forward: (fn: (...args: any[]) => any, ...args: any[]) => any; // FIXME: infer forward type
}) => {
  const client = {
    onMessage: async (event: MessageEvent<{ pluginMessage: ShowUICommand | ExportBorderlessCommand | undefined }>) => {
      const payload = event?.data?.pluginMessage;
      if (payload == null) {
        return;
      }

      switch (payload.action) {
        case 'showUI':
          forward(setFilename, payload.name);
          break;
        case 'exportBorderless':
          const borderRemoved = await Promise.all(payload.assets.map((a) => forward(removeBorder, a)));
          await forward(zip, borderRemoved);
          forward(client.close, { action: 'close' });
          break;
      }
    },

    exportFromSettings: (command: ExportCommand) => {
      window.parent.postMessage(
        {
          pluginMessage: command,
        },
        '*',
      );
    },

    close: (command: CloseCommand) => {
      window.parent.postMessage(
        {
          pluginMessage: command,
        },
        '*',
      );
    },
  };
  return client;
};
