import { removeBorder } from './image';
import { Asset } from './types';
import { zip } from './zip';

window.onmessage = async (event) => {
  const assets = event?.data?.pluginMessage?.assets as Asset[];
  if (assets == null) {
    return;
  }

  const borderRemoved = await Promise.all(assets.map((a) => removeBorder(a)));

  await zip(borderRemoved);

  window.parent.postMessage({ pluginMessage: 'Ready for download.' }, '*');
};
