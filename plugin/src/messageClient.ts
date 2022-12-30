import { ExportBorderlessCommand, ShowUICommand } from '../../shared/types';
import { exportImages } from './exportImage';

type MessageClient = {
  onMessage: MessageEventHandler;
  showUI: (payload: ShowUICommand) => void;
  borderlessExport: (payload: ExportBorderlessCommand) => void;
};

export const createMessageClient = (figma: PluginAPI): MessageClient => {
  const client: MessageClient = {
    showUI: (payload) => {
      figma.ui.postMessage(payload);
    },
    borderlessExport: (payload) => {
      figma.ui.postMessage(payload);
    },
    onMessage: async (event) => {
      const { selection } = figma.currentPage;
      if (selection.length === 0) {
        figma.closePlugin('Please select at least one node');
      }

      const assets = await exportImages({
        properties: event.properties,
        selection,
      });

      client.borderlessExport({
        action: 'exportBorderless',
        assets,
      });
    },
  };
  return client;
};
