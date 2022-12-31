import { ExportBorderlessCommand, ExportCommand, ShowUICommand } from '../../shared/types';
import { exportImages } from './exportImage';

type MessageClient = {
  onMessage: (pluginMessage: ExportCommand, props: OnMessageProperties) => Promise<void>;
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
    onMessage: async (event: ExportCommand) => {
      switch (event.action) {
        case 'export':
          const { selection } = figma.currentPage;
          if (selection.length === 0) {
            forward(figma.closePlugin, 'Please select at least one node');
            break;
          }

          const assets = await forward(exportImages, {
            properties: event.properties,
            selection,
          });

          forward(client.borderlessExport, {
            action: 'exportBorderless',
            assets,
          });
          break;
      }
    },
  };
  return client;
};
