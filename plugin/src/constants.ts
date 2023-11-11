import { Extension, Scale } from '../../shared/types';

export const exportSettingMap: {
  [K in Extension]: {
    [S in Scale]: ExportSettingsImage;
  };
} = {
  png: {
    '0.5x': {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 0.5 },
      contentsOnly: true,
    },
    '0.75x': {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 0.75 },
      contentsOnly: true,
    },
    '1x': {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
    '1.5x': {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
    '2x': {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
    '3x': {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
    '4x': {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
  jpg: {
    '0.5x': {
      format: 'JPG',
      constraint: { type: 'SCALE', value: 0.5 },
      contentsOnly: true,
    },
    '0.75x': {
      format: 'JPG',
      constraint: { type: 'SCALE', value: 0.75 },
      contentsOnly: true,
    },
    '1x': {
      format: 'JPG',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
    '1.5x': {
      format: 'JPG',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
    '2x': {
      format: 'JPG',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
    '3x': {
      format: 'JPG',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
    '4x': {
      format: 'JPG',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
};
