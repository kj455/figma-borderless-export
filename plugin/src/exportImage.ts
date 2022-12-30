import { exportSettingMap } from './constants';
import { Asset, ExportImageProperty } from '../../shared/types';

const formatName = (name: string) => name.replace(/\s/g, '').split('/').pop()?.toString() || 'anonymous';

export type ExportImagesPayload = {
  properties: ExportImageProperty[];
  selection: readonly SceneNode[];
};

export const exportImages = async ({ properties, selection }: ExportImagesPayload): Promise<Asset[]> => {
  const assets: Asset[] = await Promise.all(
    selection.flatMap((s) =>
      properties.map(async ({ ext, scale, suffix }) => {
        const setting = exportSettingMap[ext][scale];
        return {
          name: formatName(s.name),
          setting: {
            ...setting,
            suffix: suffix,
          },
          bytes: await s.exportAsync(setting),
          width: s.width * (setting?.constraint?.value ?? 1),
          height: s.height * (setting?.constraint?.value ?? 1),
        };
      }),
    ),
  );

  return assets;
};
