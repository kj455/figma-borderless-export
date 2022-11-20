import { Asset } from './types';

const getColorIndicesForCoord = (x: number, y: number, width: number) => {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};

const trimBasedOnColor = (image: Asset, color: string) => {};

const getImageData = async (
  bytes: Uint8Array,
  width: number,
  height: number
): Promise<ImageData | null> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(ctx?.getImageData(0, 0, width, height) ?? null);
    };
  });
};

export const removeBorder = async ({
  bytes,
  name,
  width,
  height,
  setting,
}: Asset): Promise<Asset> => {
  const imageData = await getImageData(bytes, width, height);
  console.log(imageData);

  // trim top left border
  const topLeftPixel = getColorIndicesForCoord(0, 0, width);

  // trim bottom right border

  console.log('TODO: removeBorder');

  return {
    bytes: bytes,
    name: name,
    setting: setting,
    width: width,
    height: height,
  };
};
