import { createSignal } from 'solid-js';

const DEFAULT_FILENAME = 'image';

export const [filename, setFilename] = createSignal(DEFAULT_FILENAME);
