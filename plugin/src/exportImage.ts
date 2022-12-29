import { exportSettingMap } from './constants';

const formatName = (name: string) => name.replace(/\s/g, '').split('/').pop()?.toString() || 'anonymous';

export type ExportImagesPayload = {
  ext: Extension;
  scaleList: Scale[];
  selection: readonly SceneNode[];
};
export const exportImages = async ({ ext, scaleList, selection }: ExportImagesPayload): Promise<Asset[]> => {
  const settings = scaleList.map((scale) => exportSettingMap[ext][scale]);

  const assets: Asset[] = await Promise.all(
    settings.flatMap((setting) =>
      selection.map(async (s) => ({
        name: formatName(s.name),
        setting,
        bytes: await s.exportAsync(setting),
        width: s.width * (setting.constraint?.value ?? 1),
        height: s.height * (setting.constraint?.value ?? 1),
      })),
    ),
  );

  return assets;
};
