type ExportFileSettings = ExportSettings;

export type Asset = {
  name: string;
  setting: ExportFileSettings;
  bytes: Uint8Array;
  width: number;
  height: number;
};
