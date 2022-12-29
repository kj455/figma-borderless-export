import { Asset } from '../../shared/types';
import { removeBorder } from './image';
import { setFilename } from './state';
import { zip } from './zip';

window.onmessage = async (event) => {
  const name = event?.data?.pluginMessage?.name as string | null;
  if (name != null) {
    setFilename(name);
  }

  const assets = event?.data?.pluginMessage?.assets as Asset[] | null;
  if (assets == null) {
    return;
  }

  const borderRemoved = await Promise.all(assets.map((a) => removeBorder(a)));

  await zip(borderRemoved);

  window.parent.postMessage({ pluginMessage: 'Ready for download.' }, '*');
};
