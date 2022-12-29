import { exportSettingMap } from '../constants';
import { exportImages, ExportImagesPayload } from '../exportImage';

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
        ext: 'png',
        scaleList: ['1x', '2x'],
        selection: [
          createSceneNode({
            name: 'png 1',
            width: 100,
            height: 100,
            exportAsync: jest.fn().mockResolvedValue('exportAsync'),
          }),
        ],
      },
      expected: [
        {
          name: 'png1',
          setting: exportSettingMap['png']['1x'],
          bytes: 'exportAsync',
          width: 100,
          height: 100,
        },
        {
          name: 'png1',
          setting: exportSettingMap['png']['2x'],
          bytes: 'exportAsync',
          width: 200,
          height: 200,
        },
      ],
    },
  ])('exportImages - $case', async ({ input, expected }) => {
    expect(await exportImages(input)).toEqual(expected);
  });
});
