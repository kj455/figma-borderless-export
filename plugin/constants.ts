export const EXTENSION_LIST: Readonly<Extension[]> = ['png', 'jpg'] as const;
export const SCALE_LIST: Readonly<Scale[]> = ['1x', '1.5x', '2x'] as const;

export const exportSettingMap: {
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
