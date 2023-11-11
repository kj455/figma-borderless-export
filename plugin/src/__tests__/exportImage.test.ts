import * as TE from '../../../node_modules/fp-ts/TaskEither';
import { exportSettingMap } from '../constants';
import { exportImages, ExportImagesPayload } from '../exportImage';
import { pipe } from 'fp-ts/lib/function';

describe('exportImage', () => {
  type PickedSceneNode = Pick<SceneNode, 'name' | 'width' | 'height' | 'exportAsync'>;

  const createSceneNode = (properties: Partial<PickedSceneNode>): SceneNode => {
    return {
      name: 'name',
      width: 0,
      height: 0,
      exportAsync: jest.fn(),
      ...properties,
    } as SceneNode;
  };

  test.each<{ case: string; input: ExportImagesPayload; expected: {} }>([
    {
      case: 'export multiple images',
      input: {
        properties: [
          {
            ext: 'png',
            scale: '1.5x',
            suffix: '@1.5x',
          },
          {
            ext: 'jpg',
            scale: '2x',
            suffix: '@2x',
          },
        ],
        selection: [
          createSceneNode({
            name: 'image 1',
            width: 100,
            height: 100,
            exportAsync: jest.fn().mockResolvedValue('exportAsync'),
          }),
          createSceneNode({
            name: 'image 2',
            width: 100,
            height: 100,
            exportAsync: jest.fn().mockResolvedValue('exportAsync'),
          }),
        ],
      },
      expected: [
        {
          name: 'image1',
          setting: {
            ...exportSettingMap['png']['1.5x'],
            suffix: '@1.5x',
          },
          bytes: 'exportAsync',
          width: 150,
          height: 150,
        },
        {
          name: 'image1',
          setting: {
            ...exportSettingMap['jpg']['2x'],
            suffix: '@2x',
          },
          bytes: 'exportAsync',
          width: 200,
          height: 200,
        },
        {
          name: 'image2',
          setting: {
            ...exportSettingMap['png']['1.5x'],
            suffix: '@1.5x',
          },
          bytes: 'exportAsync',
          width: 150,
          height: 150,
        },
        {
          name: 'image2',
          setting: {
            ...exportSettingMap['jpg']['2x'],
            suffix: '@2x',
          },
          bytes: 'exportAsync',
          width: 200,
          height: 200,
        },
      ],
    },
  ])('exportImages - $case', async ({ input, expected }) => {
    expect(await pipe(input, exportImages)()).toEqual(await TE.right(expected)());
  });
});
