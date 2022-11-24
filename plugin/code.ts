type Asset = {
  name: string;
  setting: ExportSettingsImage;
  bytes: Uint8Array;
  width: number;
  height: number;
};

type Extension = typeof EXTENSION_LIST[number];
type Scale = typeof SCALE_LIST[number];

const EXTENSION_LIST = ['png', 'jpg'] as const;
const SCALE_LIST = ['1x', '1.5x', '2x'] as const;
const exportSettingMap: {
  [key in Extension]: {
    [key in Scale]: ExportSettingsImage;
  };
} = {
  png: {
    '1x': {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
    '1.5x': {
      format: 'PNG',
      suffix: '@1.5x',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
    '2x': {
      format: 'PNG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  jpg: {
    '1x': {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
    '1.5x': {
      format: 'JPG',
      suffix: '@1.5x',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
    '2x': {
      format: 'JPG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
};

const formatName = (name: string) =>
  name.replace(/\s/g, '').split('/').pop()?.toString() || 'anonymous';

const parseCommand = (
  command: string
): { ext: Extension; scaleList: Scale[] } => {
  const [ext, scaleListStr] = command.split(':');
  if (!EXTENSION_LIST.includes(ext as Extension)) {
    throw new Error(`Could not parse command. extension: ${ext}`);
  }

  const scaleList = scaleListStr.split(',');
  if (
    scaleList.length === 0 ||
    scaleList.some((s) => !SCALE_LIST.includes(s as Scale))
  ) {
    figma.closePlugin(`Could not parse command. scale: ${scaleListStr}`);
  }

  return { ext: ext as Extension, scaleList: scaleList as Scale[] };
};

const main = async (command: string) => {
  const { selection } = figma.currentPage;
  if (selection.length > 0) {
    figma.showUI(__html__, { visible: false });

    const { ext, scaleList } = parseCommand(command);
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
      })
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
