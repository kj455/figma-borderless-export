import { EXTENSION_LIST, SCALE_LIST } from './constants';

export const parseCommand = (command: string): { ext: Extension | null; scaleList: Scale[] | null } => {
  const [ext, scaleListStr] = command.split(':');
  if (!EXTENSION_LIST.includes(ext as Extension)) {
    console.error(`Could not parse command. extension: ${ext}`);
    return { ext: null, scaleList: null };
  }

  const scaleList = scaleListStr.split(',');
  if (scaleList.length === 0 || scaleList.some((s) => !SCALE_LIST.includes(s as Scale))) {
    console.error(`Could not parse command. scale: ${scaleListStr}`);
    return { ext: null, scaleList: null };
  }

  return { ext: ext as Extension, scaleList: scaleList as Scale[] };
};
