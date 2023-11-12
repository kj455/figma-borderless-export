import { ExportCommand } from '../../../shared/types';
import { removeBorder } from '../image';
import { createMessageClient } from '../messageClient';
import { setFilename } from '../state';
import { zip } from '../zip';

describe('MessageClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('exportFromSettings', () => {
    const window = {
      parent: {
        postMessage: jest.fn(),
      },
    };
    const client = createMessageClient({ window } as never);

    client.dispatch({ action: 'export', properties: [] });

    expect(window.parent.postMessage.mock.calls).toEqual([
      [
        {
          pluginMessage: {
            action: 'export',
            properties: [],
          },
        },
        '*',
      ],
    ]);
  });

  describe('onMessage', () => {
    test('showUI', () => {
      const forward = jest.fn();
      const client = createMessageClient({ forward } as never);

      client.onMessage({
        data: {
          pluginMessage: {
            action: 'showUI',
            name: 'foo',
          },
        },
      } as never);

      expect(forward.mock.calls).toEqual([[setFilename, 'foo']]);
    });

    test('exportBorderless', async () => {
      const forward = jest.fn((fn, args) => {
        switch (fn) {
          case removeBorder:
            return 'borderRemoved';
          case zip:
            return 'zip';
        }
      });
      const window = {
        parent: {
          postMessage: jest.fn(),
        },
      } as never;

      const client = createMessageClient({ forward, window } as never);

      await client.onMessage({
        data: {
          pluginMessage: {
            action: 'exportBorderless',
            assets: ['asset1', 'asset2'],
          },
        },
      } as never);

      expect(forward.mock.calls).toEqual([
        [removeBorder, 'asset1'],
        [removeBorder, 'asset2'],
        [zip, ['borderRemoved', 'borderRemoved']],
        [client.dispatch, { action: 'close' }],
      ]);
    });
  });
});
