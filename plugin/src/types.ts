type Asset = {
  name: string;
  setting: ExportSettingsImage;
  bytes: Uint8Array;
  width: number;
  height: number;
};

type Extension = 'png' | 'jpg';
type Scale = '1x' | '1.5x' | '2x';
