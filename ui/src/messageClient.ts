import { Asset, Command, ExportCommand } from '../../shared/types';
import { removeBorder } from './image';
import { setFilename } from './state';
import { zip } from './zip';

export const createMessageClient = (window: Window) => {
  return {
    onMessage: async (event: MessageEvent<any>) => {
      const name = event?.data?.pluginMessage?.name as string | null;
      if (name != null) {
        setFilename(name);
      }

      const assets = event?.data?.pluginMessage?.assets as Asset[] | null;
      if (assets == null) {
        return;
      }

      const borderRemoved = await Promise.all(assets.map((a) => removeBorder(a)));

      await zip(borderRemoved);
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
