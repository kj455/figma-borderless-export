type ExportFileSettings =
  | ExportSettingsImage
  | ExportSettingsPDF
  | ExportSettingsSVG;

type Asset = {
  name: string;
  setting: ExportSetting;
  bytes: Uint8Array;
};

type ExportSetting = ExportFileSettings;

type Extension = 'png' | 'jpg' | 'svg';
const exportSettingMap: Record<Extension, ExportSetting[]> = {
  png: [
    {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
    {
      format: 'PNG',
      suffix: '@1.5x',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
    {
      format: 'PNG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  ],
  jpg: [
    {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
    {
      format: 'JPG',
      suffix: '@1.5x',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
    {
      format: 'JPG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  ],
  svg: [
    {
      format: 'SVG',
      suffix: '',
      contentsOnly: true,
    },
  ],
};

const main = async (command: string) => {
  const { selection } = figma.currentPage;
  if (selection.length > 0) {
    figma.showUI(__html__, { visible: false });

    const assets: Asset[] = await Promise.all(
      exportSettingMap[command as Extension].flatMap((setting) => {
        return selection.map(async (selection) => {
          return {
            name:
              selection.name.replace(/\s/g, '').split('/').pop()?.toString() ||
              'anonymous',
            setting,
            bytes: await selection.exportAsync(setting),
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
