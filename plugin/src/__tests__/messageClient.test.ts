import { ExportBorderlessCommand, ExportCommand, ShowUICommand } from '../../../shared/types';
import { exportImages } from '../exportImage';
import { createMessageClient } from '../messageClient';

describe('messageClient', () => {
  // beforeEach(() => {
  //   jest.resetAllMocks();
  // });

  describe('dispatch', () => {
    test('showUI', () => {
      const figma = {
        ui: {
          postMessage: jest.fn(),
        },
      };
      const client = createMessageClient(figma as never);

      client.dispatch({ action: 'showUI', name: 'foo' });

      expect(figma.ui.postMessage.mock.calls).toEqual([
        [
          {
            action: 'showUI',
            name: 'foo',
          },
        ],
      ]);
    });

    test('borderlessExport', () => {
      const figma = {
        ui: {
          postMessage: jest.fn(),
        },
      };
      const client = createMessageClient(figma as never);

      client.dispatch({ action: 'exportBorderless', assets: ['asset'] } as never);

      expect(figma.ui.postMessage.mock.calls).toEqual([
        [
          {
            action: 'exportBorderless',
            assets: ['asset'],
          },
        ],
      ]);
    });
  });

  describe('onMessage', () => {
    test('export - no selection', async () => {
      const figma = {
        currentPage: {
          selection: [],
        },
        closePlugin: jest.fn(),
      };
      const client = createMessageClient(figma as never);

      await client.onMessage({ action: 'export' } as never);

      expect(figma.closePlugin.mock.calls).toEqual([[expect.any(String)]]);
    });

    test('export - with selection', async () => {
      const figma = {
        currentPage: {
          selection: ['node'],
        },
        closePlugin: jest.fn(),
        notify: jest.fn(),
        ui: {
          postMessage: jest.fn(),
        },
      };
      const client = createMessageClient(figma as never);
      const dispatch = jest.spyOn(client, 'dispatch');

      await client.onMessage({ action: 'export', properties: [] } as never);

      expect(figma.notify.mock.calls).toEqual([[expect.any(String), { timeout: Infinity }]]);
      expect(dispatch.mock.calls).toEqual([
        [
          {
            action: 'exportBorderless',
            assets: [],
          },
        ],
      ]);
    });

    test('close', () => {
      const figma = {
        closePlugin: jest.fn(),
      };
      const client = createMessageClient(figma as never);

      client.onMessage({ action: 'close' } as never);

      expect(figma.closePlugin.mock.calls).toEqual([[]]);
    });
  });
});
