import { ExportBorderlessCommand, ExportCommand, ShowUICommand } from '../../../shared/types';
import { exportImages } from '../exportImage';
import { createMessageClient } from '../messageClient';

describe('messageClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('showUI', () => {
    const forward = jest.fn();
    const figma = {
      ui: {
        postMessage: jest.fn(),
      },
    };
    const payload = { action: 'showUI', name: 'foo' } satisfies ShowUICommand;

    const client = createMessageClient({ forward, figma } as never);

    client.showUI(payload);

    expect(forward.mock.calls).toEqual([
      [
        figma.ui.postMessage,
        {
          action: 'showUI',
          name: 'foo',
        },
      ],
    ]);
  });

  test('borderlessExport', () => {
    const forward = jest.fn();
    const figma = {
      ui: {
        postMessage: jest.fn(),
      },
    };
    const payload = { action: 'exportBorderless', assets: [] } satisfies ExportBorderlessCommand;

    const client = createMessageClient({ forward, figma } as never);

    client.borderlessExport(payload);

    expect(forward.mock.calls).toEqual([
      [
        figma.ui.postMessage,
        {
          action: 'exportBorderless',
          assets: [],
        },
      ],
    ]);
  });

  describe('onMessage', () => {
    test('export - no selection', () => {
      const forward = jest.fn();
      const figma = {
        currentPage: {
          selection: [],
        },
        closePlugin: jest.fn(),
      };
      const payload = { action: 'export', properties: [] } satisfies ExportCommand;

      const client = createMessageClient({ forward, figma } as never);

      client.onMessage(payload as never, {} as never);

      expect(forward.mock.calls).toEqual([
        [figma.closePlugin, expect.any(String)],
      ]);
    })

    test('export - with selection', async () => {
      const forward = jest.fn((fn, args) => {
        switch (fn) {
          case exportImages:
            return 'assets';
          case client.borderlessExport:
            return 'borderlessExport';
        }
      });
      const figma = {
        currentPage: {
          selection: ['node'],
        },
        closePlugin: jest.fn(),
        notify: jest.fn(),
      };
      const payload = { action: 'export', properties: [] } satisfies ExportCommand;

      const client = createMessageClient({ forward, figma } as never);

      await client.onMessage(payload as never, {} as never);

      expect(forward.mock.calls).toEqual([
        [figma.notify, expect.any(String), expect.any(Object)],
        [exportImages, { properties: [], selection: ['node'] }],
        [client.borderlessExport, { action: 'exportBorderless', assets: 'assets' }],
      ]);
    })

    test('export - error', async () => {
      const cancelNotification = jest.fn();
      const forward = jest.fn((fn, args) => {
        switch (fn) {
          case exportImages:
            throw new Error('error');
          case figma.notify:
            return {
              cancel: cancelNotification,
            }
        }
      });
      const figma = {
        currentPage: {
          selection: ['node'],
        },
        closePlugin: jest.fn(),
        notify: jest.fn(),
      };
      const payload = { action: 'export', properties: [] } satisfies ExportCommand;

      const client = createMessageClient({ forward, figma } as never);

      await client.onMessage(payload as never, {} as never);

      expect(forward.mock.calls).toEqual([
        [figma.notify, expect.any(String), expect.any(Object)],
        [exportImages, { properties: [], selection: ['node'] }],
      ]);
      expect(cancelNotification.mock.calls).toEqual([[]])
    })
  })
});
