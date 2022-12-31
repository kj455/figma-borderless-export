import { CloseCommand, ExportBorderlessCommand, ExportCommand, ShowUICommand } from '../../shared/types';
import { exportImages } from './exportImage';

type MessageClient = {
  onMessage: (pluginMessage: ExportCommand | CloseCommand, props: OnMessageProperties) => Promise<void>;
  showUI: (payload: ShowUICommand) => void;
  borderlessExport: (payload: ExportBorderlessCommand) => void;
};

export const createMessageClient = ({
  figma,
  forward,
}: {
  figma: PluginAPI;
  forward: (fn: (...args: any[]) => any, ...args: any[]) => any; // FIXME: infer forward type
}): MessageClient => {
  const client: MessageClient = {
    showUI: (payload) => {
      forward(figma.ui.postMessage, payload);
    },
    borderlessExport: (payload) => {
      forward(figma.ui.postMessage, payload);
    },
    onMessage: async (event) => {
      switch (event.action) {
        case 'export':
          let notificationHandler: NotificationHandler | null = null;
          try {
            const { selection } = figma.currentPage;
            if (selection.length === 0) {
              forward(figma.closePlugin, 'Please select at least one node');
              break;
            }

            notificationHandler = forward(figma.notify, 'Exporting images...', { timeout: Infinity });

            // FIXME: remove this hack
            await new Promise((resolve) => setTimeout(resolve, 0));

            const assets = await forward(exportImages, {
              properties: event.properties,
              selection,
            });

            forward(client.borderlessExport, {
              action: 'exportBorderless',
              assets,
            });
          } catch (error) {
            notificationHandler?.cancel();
          }
          break;
        case 'close':
          forward(figma.closePlugin);
      }
    },
  };
  return client;
};
