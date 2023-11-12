import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { CloseCommand, ExportBorderlessCommand, ExportCommand, ShowUICommand } from '../../shared/types';
import { exportImages } from './exportImage';

type MessageClient = {
  dispatch: (command: ShowUICommand | ExportBorderlessCommand) => Promise<void>;
  onMessage: (command: ExportCommand | CloseCommand) => Promise<void>;
};

export const createMessageClient = (figma: PluginAPI): MessageClient => {
  const client: MessageClient = {
    dispatch: async (command) => {
      switch (command.action) {
        case 'showUI':
          figma.ui.postMessage(command);
          break;
        case 'exportBorderless':
          figma.ui.postMessage(command);
          break;
      }
    },
    onMessage: async (event) => {
      switch (event.action) {
        case 'export':
          let notificationHandler: NotificationHandler | null = null;

          await pipe(
            TE.right(figma.currentPage.selection),
            TE.chain((s) => {
              if (s.length === 0) {
                figma.closePlugin('Please select at least one node');
                return TE.left(new Error('empty selection'));
              }

              notificationHandler = figma.notify('Exporting images...', { timeout: Infinity });
              return TE.right(s);
            }),
            TE.flatMap((selection) =>
              exportImages({
                properties: event.properties,
                selection,
              }),
            ),
            TE.match(
              (error) => {
                notificationHandler?.cancel();
                return TE.left(error);
              },
              (assets) => {
                client.dispatch({
                  action: 'exportBorderless',
                  assets,
                });
                notificationHandler?.cancel();
                return TE.right(assets);
              },
            ),
          )();
          break;

        case 'close':
          figma.closePlugin();
      }
    },
  };
  return client;
};
