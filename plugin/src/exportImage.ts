import * as A from '../../node_modules/fp-ts/Array';
import * as TE from '../../node_modules/fp-ts/lib/TaskEither';
import * as F from '../../node_modules/fp-ts/lib/function';
import { Asset, ExportImageProperty } from '../../shared/types';
import { exportSettingMap } from './constants';

const formatName = (name: string) => name.replace(/\s/g, '').split('/').pop()?.toString() || 'anonymous';

const exportAsset =
  (s: SceneNode) =>
  ({ ext, scale, suffix }: ExportImageProperty): TE.TaskEither<Error, Asset> => {
    const setting = exportSettingMap[ext][scale];
    return F.pipe(
      TE.tryCatch(
        () => s.exportAsync(setting),
        (reason) => new Error('exportAsync failed', { cause: reason }),
      ),
      TE.map((bytes) => ({
        name: formatName(s.name),
        setting: {
          ...setting,
          suffix,
        },
        bytes,
        width: s.width * (setting?.constraint?.value ?? 1),
        height: s.height * (setting?.constraint?.value ?? 1),
      })),
    );
  };

export type ExportImagesPayload = {
  properties: ExportImageProperty[];
  selection: readonly SceneNode[];
};
export const exportImages = ({
  properties,
  selection,
}: ExportImagesPayload): TE.TaskEither<Error, readonly Asset[]> => {
  return F.pipe(
    selection as SceneNode[],
    A.flatMap((s) => properties.map(exportAsset(s))),
    TE.sequenceArray,
  );
};
