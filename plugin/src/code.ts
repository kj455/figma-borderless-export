import { parseCommand } from './command';
import { exportImages } from './exportImage';
import { createMessageClient } from './messageClient';

const messageClient = createMessageClient(figma);

const main = async (_command: string) => {
  const { selection } = figma.currentPage;
  if (selection.length === 0) {
    figma.closePlugin('Please select at least one node');
  }

  const command = parseCommand(_command);
  if (command == null) {
    return figma.closePlugin('Invalid command');
  }

  switch (command.action) {
    case 'showUI':
      figma.showUI(__html__, { width: 240, height: 240 });
      messageClient.showUI({ action: 'showUI', name: selection.length > 1 ? 'images' : selection[0].name });
      break;

    case 'export':
      figma.showUI(__html__, { visible: false });

      const { properties } = command;

      const assets = await exportImages({
        properties,
        selection,
      });

      console.log({ assets });

      messageClient.borderlessExport({
        action: 'exportBorderless',
        assets,
      });
  }
};

main(figma.command);

figma.ui.onmessage = messageClient.onMessage;