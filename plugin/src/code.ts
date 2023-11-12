import { match } from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { parseCommand } from './command';
import { exportImages } from './exportImage';
import { createMessageClient } from './messageClient';

const messageClient = createMessageClient(figma);

const main = async (commandStr: string) => {
  const { selection } = figma.currentPage;
  if (selection.length === 0) {
    figma.closePlugin('Please select at least one node');
  }

  pipe(
    parseCommand(commandStr),
    match(
      () => figma.closePlugin('Invalid command'),
      async (command) => {
        switch (command.action) {
          case 'showUI':
            figma.showUI(__html__, { width: 240, height: 240 });
            messageClient.dispatch({ action: 'showUI', name: selection.length > 1 ? 'images' : selection[0].name });
            break;

          case 'export':
            figma.notify('Running borderless-export', { timeout: 1000 });

            await sleep(500); // NOTE: necessary to show notification

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

main(figma.command);

figma.ui.onmessage = messageClient.onMessage;
