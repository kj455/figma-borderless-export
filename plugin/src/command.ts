import { EXTENSION_LIST, SCALE_LIST } from './constants';

type Command =
  | {
      action: 'showUI';
    }
  | {
      action: 'export';
      ext: Extension | null;
      scaleList: Scale[] | null;
    };

export const parseCommand = (command: string): Command => {
  const [action, ext, scaleListStr] = command.split(':');

  switch (action) {
    case 'export':
      const scaleList = scaleListStr.split(',');

      const isValidExt = EXTENSION_LIST.includes(ext as Extension);
      const isValidScaleList = scaleListStr.split(',').every((s) => SCALE_LIST.includes(s as Scale));

      if (!isValidExt || !isValidScaleList) {
        return { action: 'export', ext: null, scaleList: null };
      }

      return {
        action: 'export',
        ext: ext as Extension,
        scaleList: scaleList as Scale[],
      };

    case 'showUI':
      return {
        action: 'showUI',
      };

    default:
      throw new Error(`Could not parse command. action: ${action}`);
  }
};
