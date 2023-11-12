import { Option, none, some } from 'fp-ts/lib/Option';
import { DEFAULT_SCALE, EXTENSION_LIST, SCALE_LIST } from '../../shared/constants';
import { Command, Extension, Scale } from '../../shared/types';

export const parseCommand = (command: string): Option<Command> => {
  const [action, ext, scaleListStr] = command.split(':');

  switch (action) {
    case 'export':
      const scaleList = scaleListStr.split(',');

      const isValidExt = EXTENSION_LIST.includes(ext as Extension);
      const isValidScaleList = scaleListStr.split(',').every((s) => SCALE_LIST.includes(s as Scale));

      if (!isValidExt || !isValidScaleList) {
        return none;
      }

      return some({
        action: 'export',
        properties: scaleList.map((scale) => ({
          ext: ext as Extension,
          scale: scale as Scale,
          suffix: scale !== DEFAULT_SCALE ? `@${scale}` : '',
        })),
      });

    case 'showUI':
      return some({
        action: 'showUI',
        name: '',
      });

    default:
      return none;
  }
};
