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

export type Pixel = [r: number, g: number, b: number, a: number];
