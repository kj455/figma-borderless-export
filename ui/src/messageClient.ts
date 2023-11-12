import { CloseCommand, ExportBorderlessCommand, ExportCommand, ShowUICommand } from '../../shared/types';
import { Forward } from '../../shared/utils';
import { removeBorder } from './image';
import { setFilename } from './state';
import { zip } from './zip';

type MessageClient = {
  dispatch: (command: ExportCommand | CloseCommand) => void;
  onMessage: (
    event: MessageEvent<{ pluginMessage: ShowUICommand | ExportBorderlessCommand | undefined }>,
  ) => Promise<void>;
};

export const createMessageClient = ({ window, forward }: { window: Window; forward: Forward }): MessageClient => {
  const client: MessageClient = {
    dispatch: (command) => {
      switch (command.action) {
        case 'export':
          window.parent.postMessage({ pluginMessage: command }, '*');
          break;
        case 'close':
          window.parent.postMessage({ pluginMessage: command }, '*');
          break;
      }
    },

    onMessage: async (event) => {
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
          forward(client.dispatch, {
            action: 'close',
          });
          break;
      }
    },
  };
  return client;
};
