import { parseCommand } from './command';
import { exportImages } from './exportImage';

const main = async (_command: string) => {
  const { selection } = figma.currentPage;
  if (selection.length === 0) {
    figma.closePlugin('Please select at least one node');
  }

  const command = parseCommand(_command);
  switch (command.action) {
    case 'showUI':
      figma.showUI(__html__, { width: 320, height: 480 });
      figma.ui.postMessage({ action: 'showUI' });
      break;

    case 'export':
      figma.showUI(__html__, { visible: false });

      const { ext, scaleList } = command;
      if (ext == null || scaleList == null) {
        return figma.closePlugin('Could not parse command.');
      }

      const assets = await exportImages({ ext, scaleList, selection });
      figma.ui.postMessage({ action: 'export', assets });
  }
};

main(figma.command);

figma.ui.onmessage = (msg) => {
  figma.closePlugin(msg);
};
