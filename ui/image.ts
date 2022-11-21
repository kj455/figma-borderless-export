import { Asset } from './types';

const getPixel = (
  image: ImageData,
  x: number,
  y: number
): [r: number, g: number, b: number, a: number] => {
  const red = y * (image.width * 4) + x * 4;

  return [
    image.data[red],
    image.data[red + 1],
    image.data[red + 2],
    image.data[red + 3],
  ];
};

// Encoding an image is also done by sticking pixels in an
// HTML canvas and by asking the canvas to serialize it into
// an actual PNG file via canvas.toBlob().
async function encode(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  imageData: ImageData
): Promise<Uint8Array> {
  ctx.putImageData(imageData, 0, 0);
  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(new Uint8Array(reader.result as ArrayBufferLike));
      reader.onerror = () => reject(new Error('Could not read from blob'));
      reader.readAsArrayBuffer(blob ?? new Blob());
    });
  });
}

// Decoding an image can be done by sticking it in an HTML
// canvas, as we can read individual pixels off the canvas.
async function decode(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  bytes: Uint8Array
): Promise<ImageData> {
  const url = URL.createObjectURL(new Blob([bytes]));
  const image: HTMLImageElement = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  return imageData;
}

export const removeBorder = async (asset: Asset): Promise<Asset> => {
  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    console.error('Could not get canvas context');
    return asset;
  }

  const data = await decode(canvas, ctx, asset.bytes);
  if (data == null) {
    console.error('Could not decode image');
    return asset;
  }

  // trim top left border
  const topLeftPixel = getPixel(data, 0, 0);
  console.log({ topLeftPixel });

  // trim bottom right border
  const bottomRightPixel = getPixel(data, data.width - 1, data.height - 1);
  console.log({ bottomRightPixel });

  const newBytes = await encode(canvas, ctx, data);

  return { ...asset, bytes: newBytes };
};
