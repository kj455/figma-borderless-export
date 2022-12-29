import { EXTENSION_LIST, SCALE_LIST } from './constants';

/**
 * extract necessary types from @figma
 */
type ExportSettingsImage = {
  readonly format: 'JPG' | 'PNG';
  readonly contentsOnly?: boolean; // defaults to true
  readonly useAbsoluteBounds?: boolean; // defaults to false
  readonly suffix?: string;
  readonly constraint?: ExportSettingsConstraints;
};
type ExportSettingsConstraints = {
  readonly type: 'SCALE' | 'WIDTH' | 'HEIGHT';
  readonly value: number;
};

/**
 * Original types below
 */
export type Asset = {
  name: string;
  setting: ExportSettingsImage;
  bytes: Uint8Array;
  width: number;
  height: number;
};

export type Extension = typeof EXTENSION_LIST[number];
export type Scale = typeof SCALE_LIST[number];
