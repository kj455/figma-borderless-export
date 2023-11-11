import { match } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { forward } from '../../shared/utils';
import { parseCommand } from './command';
import { exportImages } from './exportImage';
import { createMessageClient } from './messageClient';

const messageClient = createMessageClient(figma);

const main = async (_command: string) => {
  const { selection } = figma.currentPage;
  if (selection.length === 0) {
    figma.closePlugin('Please select at least one node');
  }

  pipe(
    parseCommand(_command),
    match(
      () => figma.closePlugin('Invalid command'),
      async (command) => {
        switch (command.action) {
          case 'showUI':
            figma.showUI(__html__, { width: 240, height: 240 });
            messageClient.dispatch({ action: 'showUI', name: selection.length > 1 ? 'images' : selection[0].name });
            break;

          case 'export':
            figma.showUI(__html__, { visible: false });

            pipe(
              {
                properties: command.properties,
                selection,
              },
              exportImages,
              TE.map((assets) => {
                messageClient.dispatch({
                  action: 'exportBorderless',
                  assets,
                });
              }),
            )();
        }
      },
    ),
  );
};

main(figma.command);

figma.ui.onmessage = messageClient.onMessage;
