import { Asset } from './types';

export const getPixel = (
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

export const calcGray = (r: number, g: number, b: number): number =>
  Math.round(0.299 * r + 0.587 * g + 0.114 * b);

export const getPixelGray = (
  image: ImageData,
  x: number,
  y: number
): number => {
  const [r, g, b] = getPixel(image, x, y);
  return calcGray(r, g, b);
};

// Encoding an image is also done by sticking pixels in an
// HTML canvas and by asking the canvas to serialize it into
// an actual PNG file via canvas.toBlob().
async function encode(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  [dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight]: [
    dx: number,
    dy: number,
    dirtyX: number,
    dirtyY: number,
    dirtyWidth: number,
    dirtyHeight: number
  ]
): Promise<Uint8Array> {
  canvas.width = dirtyWidth;
  canvas.height = dirtyHeight;

  ctx.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
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

const drawImage = (image: ImageData) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.putImageData(image, 0, 0);
  document.body.appendChild(canvas);
};

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

export const hasBorder = (
  image: ImageData,
  direction: 'top' | 'bottom' | 'left' | 'right'
): boolean => {
  const pixelDiffThreshold = 0.2 * 256; // 20% of 256
  let diffCount = 0;
  const diffThreshold = 0.8; // 80% of the width

  switch (direction) {
    case 'top':
      for (let x = 1; x < image.width - 1; x++) {
        const dx = [-1, 0, 1];
        const dy = [1, 2];
        const around = dx.flatMap((ddx) =>
          dy.map((ddy) => getPixelGray(image, x + ddx, 0 + ddy))
        );
        const average = around.reduce((a, b) => a + b, 0) / around.length;
        if (
          Math.abs(average - getPixelGray(image, x, 0)) > pixelDiffThreshold
        ) {
          diffCount++;
        }
      }
      if (diffCount > (image.width - 2) * diffThreshold) {
        return true;
      }
      return false;

    case 'bottom':
      for (let x = 1; x < image.width - 1; x++) {
        const dx = [-1, 0, 1];
        const dy = [-2, -1];
        const around = dx.flatMap((ddx) =>
          dy.map((ddy) => getPixelGray(image, x + ddx, image.height - 1 + ddy))
        );
        const average = around.reduce((a, b) => a + b, 0) / around.length;
        if (
          Math.abs(average - getPixelGray(image, x, image.height - 1)) >
          pixelDiffThreshold
        ) {
          diffCount++;
        }
      }
      if (diffCount > (image.width - 2) * diffThreshold) {
        return true;
      }
      return false;

    case 'left':
      for (let y = 1; y < image.height - 1; y++) {
        const dx = [1, 2];
        const dy = [-1, 0, 1];
        const around = dx.flatMap((ddx) =>
          dy.map((ddy) => getPixelGray(image, 0 + ddx, y + ddy))
        );
        const average = around.reduce((a, b) => a + b, 0) / around.length;
        if (
          Math.abs(average - getPixelGray(image, 0, y)) > pixelDiffThreshold
        ) {
          diffCount++;
        }
      }
      if (diffCount > (image.height - 2) * diffThreshold) {
        return true;
      }
      return false;

    case 'right':
      for (let y = 1; y < image.height - 1; y++) {
        const dx = [-2, -1];
        const dy = [-1, 0, 1];
        const around = dx.flatMap((ddx) =>
          dy.map((ddy) => getPixelGray(image, image.width - 1 + ddx, y + ddy))
        );
        const average = around.reduce((a, b) => a + b, 0) / around.length;
        if (
          Math.abs(average - getPixelGray(image, image.width - 1, y)) >
          pixelDiffThreshold
        ) {
          diffCount++;
        }
      }
      if (diffCount > (image.height - 2) * diffThreshold) {
        return true;
      }
      return false;
  }
};

export const removeBorder = async (asset: Asset): Promise<Asset> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    console.error('Could not get canvas context');
    return asset;
  }

  const img = await decode(canvas, ctx, asset.bytes);
  if (img == null) {
    console.error('Could not decode image');
    return asset;
  }

  let x = 0;
  let y = 0;
  let w = img.width;
  let h = img.height;

  if (hasBorder(img, 'left')) {
    console.log(`left border detected ${asset.setting.suffix}`);
    x = -1;
    w -= 1;
  }

  if (hasBorder(img, 'top')) {
    console.log(`top border detected ${asset.setting.suffix}`);
    y = -1;
    h -= 1;
  }

  if (hasBorder(img, 'right')) {
    console.log(`right border detected ${asset.setting.suffix}`);
    w -= 1;
  }

  if (hasBorder(img, 'bottom')) {
    console.log(`bottom border detected ${asset.setting.suffix}`);
    h -= 1;
  }

  const newBytes = await encode(canvas, ctx, img, [0, 0, x, y, w, h]);

  return { ...asset, bytes: newBytes };
};
