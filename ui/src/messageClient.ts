import { ExportBorderlessCommand, ExportCommand, ShowUICommand } from '../../shared/types';
import { removeBorder } from './image';
import { setFilename } from './state';
import { zip } from './zip';

export const createMessageClient = (window: Window) => {
  return {
    onMessage: async (event: MessageEvent<{ pluginMessage: ShowUICommand | ExportBorderlessCommand | undefined }>) => {
      const payload = event?.data?.pluginMessage;
      if (payload == null) {
        return;
      }

      switch (payload.action) {
        case 'showUI':
          setFilename(payload.name);
          break;
        case 'exportBorderless':
          const borderRemoved = await Promise.all(payload.assets.map((a) => removeBorder(a)));
          await zip(borderRemoved);
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
  };
};
