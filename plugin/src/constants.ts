import { Extension, Scale } from '../../shared/types';

export const exportSettingMap: {
  [key in Extension]: {
    [key in Scale]: ExportSettingsImage;
  };
} = {
  png: {
    '0.5x': {
      format: 'PNG',
      suffix: '@0.5x',
      constraint: { type: 'SCALE', value: 0.5 },
      contentsOnly: true,
    },
    '0.75x': {
      format: 'PNG',
      suffix: '@0.75x',
      constraint: { type: 'SCALE', value: 0.75 },
      contentsOnly: true,
    },
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
    '3x': {
      format: 'PNG',
      suffix: '@3x',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
    '4x': {
      format: 'PNG',
      suffix: '@4x',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
  jpg: {
    '0.5x': {
      format: 'JPG',
      suffix: '@0.5x',
      constraint: { type: 'SCALE', value: 0.5 },
      contentsOnly: true,
    },
    '0.75x': {
      format: 'JPG',
      suffix: '@0.75x',
      constraint: { type: 'SCALE', value: 0.75 },
      contentsOnly: true,
    },
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
    '3x': {
      format: 'JPG',
      suffix: '@3x',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
    '4x': {
      format: 'JPG',
      suffix: '@4x',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
};
