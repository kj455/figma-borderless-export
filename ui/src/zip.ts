import JSZip from 'jszip';
import { Asset } from './types';

const exportDetailMap = {
  PNG: {
    blobType: 'image/png',
    ext: '.png',
  },
  JPG: {
    blobType: 'image/jpeg',
    ext: '.jpg',
  },
} as const;

const typedArrayToBuffer = (array: Uint8Array) => {
  return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
};

export const zip = async (assets: Asset[]): Promise<void> => {
  return new Promise(async (resolve) => {
    const zip = new JSZip();

    assets.forEach((data) => {
      const { bytes, name, setting } = data;
      const detail = exportDetailMap[setting.format];
      const cleanBytes = typedArrayToBuffer(bytes);
      const blob = new Blob([cleanBytes], { type: detail.blobType });
      zip.file(`${name}${setting.suffix}${detail.ext}`, blob, {
        base64: true,
      });
    });

    const content = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(content);
    link.download = `export.zip`;
    link.click();

    setTimeout(() => {
      resolve();
    }, 600);
  });
};
