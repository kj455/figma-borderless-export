import { zip } from './zip';

type Asset = {
  name: string;
  setting: any;
  bytes: Uint8Array;
};

window.onmessage = async (event) => {
  const assets = event?.data?.pluginMessage?.assets as Asset[];
  if (assets == null) {
    return;
  }

  await zip(assets);

  window.parent.postMessage({ pluginMessage: 'Ready for download.' }, '*');
};
