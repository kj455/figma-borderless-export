import { parseCommand } from './command';
import { exportSettingMap } from './constants';

const formatName = (name: string) => name.replace(/\s/g, '').split('/').pop()?.toString() || 'anonymous';

const main = async (command: string) => {
  const { selection } = figma.currentPage;
  if (selection.length > 0) {
    figma.showUI(__html__, { visible: false });

    const { ext, scaleList } = parseCommand(command);
    if (ext == null || scaleList == null) {
      return figma.closePlugin('Could not parse command.');
    }

    const settings = scaleList.map((scale) => exportSettingMap[ext][scale]);

    const assets: Asset[] = await Promise.all(
      settings.flatMap((setting) => {
        return selection.map(async (selection) => {
          return {
            name: formatName(selection.name),
            setting,
            bytes: await selection.exportAsync(setting),
            width: selection.width * (setting.constraint?.value ?? 1),
            height: selection.height * (setting.constraint?.value ?? 1),
          };
        });
      }),
    );

    figma.ui.postMessage({ assets });
  } else {
    figma.closePlugin('Please select at least one node');
  }
};

main(figma.command);

figma.ui.onmessage = (msg) => {
  figma.closePlugin(msg);
};
