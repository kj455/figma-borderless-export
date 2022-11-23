export type Asset = {
  name: string;
  setting: ExportSettingsImage;
  bytes: Uint8Array;
  width: number;
  height: number;
};

export type Pixel = [r: number, g: number, b: number, a: number];