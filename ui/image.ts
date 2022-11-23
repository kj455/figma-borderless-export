import { Asset, Pixel } from './types';

export const getPixel = (
  image: ImageData,
  x: number,
  y: number
): Pixel | null => {
  const red = y * (image.width * 4) + x * 4;

  if (red < 0 || red > image.data.length - 4) {
    return null;
  }

  return [
    image.data[red],
    image.data[red + 1],
    image.data[red + 2],
    image.data[red + 3],
  ];
};

export const calcGray = ([r, g, b]: Pixel): number =>
  Math.round(0.299 * r + 0.587 * g + 0.114 * b);

export const getPixelGray = (
  image: ImageData,
  x: number,
  y: number
): number | null => {
  const p = getPixel(image, x, y);
  if (p == null) {
    return null;
  }
  return calcGray(p);
};

/** include half-transparent */
export const isTransparent = (p: Pixel): boolean => p[3] <= 128;

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

type Direction = 'top' | 'bottom' | 'left' | 'right';

/**
 * 1. Scanning pixels on an edge
 * 2. Calculate the average value of the 6 nearest pixels inside the target pixel
 * 3. Calculate the number of pixels for which the difference between the target pixel and the calculated average value is greater than a threshold value
 * 4. If the number exceeds a certain percentage of the number of pixels scanned, the edge is considered a border
 */
export const hasBorder = (
  image: ImageData,
  direction: Direction,
  threshold?: Partial<{
    PIXEL_DIFF_ABS: number;
    DIFF_PIXELS_ON_EDGE_RATIO: number;
  }>
): boolean => {
  /** default: 20% of 256  */
  const PIXEL_DIFF_ABS = threshold?.PIXEL_DIFF_ABS ?? 0.2 * 256;
  /** default: 70% */
  const DIFF_PIXELS_ON_EDGE_RATIO = threshold?.DIFF_PIXELS_ON_EDGE_RATIO ?? 0.7;

  const directionDetail: Record<
    Direction,
    {
      dx: number[];
      dy: number[];
      xRange: [start: number, openEnd: number];
      yRange: [start: number, openEnd: number];
    }
  > = {
    top: {
      dx: [-1, 0, 1],
      dy: [1, 2],
      xRange: [1, image.width - 1],
      yRange: [0, 1],
    },
    bottom: {
      dx: [-1, 0, 1],
      dy: [-1, -2],
      xRange: [1, image.width - 1],
      yRange: [image.height - 1, image.height],
    },
    left: {
      dx: [1, 2],
      dy: [-1, 0, 1],
      xRange: [0, 1],
      yRange: [1, image.height - 1],
    },
    right: {
      dx: [-1, -2],
      dy: [-1, 0, 1],
      xRange: [image.width - 1, image.width],
      yRange: [1, image.height - 1],
    },
  };

  const {
    dx,
    dy,
    xRange: [xStart, xEnd],
    yRange: [yStart, yEnd],
  } = directionDetail[direction];

  let diffCount = 0;
  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      const p = getPixel(image, x, y);
      if (p == null) {
        throw new Error('target to compare is null');
      }

      if (isTransparent(p)) {
        diffCount++;
        continue;
      }

      const aroundGrayList = dx
        .flatMap((dx) => dy.map((dy) => getPixelGray(image, x + dx, y + dy)))
        .filter((gray) => gray != null) as number[];
      const average =
        aroundGrayList.reduce((a, b) => a + b, 0) / aroundGrayList.length;

      const targetGray = calcGray(p);
      if (Math.abs(average - targetGray) > PIXEL_DIFF_ABS) {
        diffCount++;
      }
    }
  }

  const scannedNum = Math.max(xEnd - xStart, yEnd - yStart);

  return diffCount > scannedNum * DIFF_PIXELS_ON_EDGE_RATIO;
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
    console.log(`left border detected. ${asset.name}${asset.setting.suffix}`);
    x = -1;
    w -= 1;
  }

  if (hasBorder(img, 'top')) {
    console.log(`top border detected. ${asset.name}${asset.setting.suffix}`);
    y = -1;
    h -= 1;
  }

  if (hasBorder(img, 'right')) {
    console.log(`right border detected. ${asset.name}${asset.setting.suffix}`);
    w -= 1;
  }

  if (hasBorder(img, 'bottom')) {
    console.log(`bottom border detected. ${asset.name}${asset.setting.suffix}`);
    h -= 1;
  }

  const newBytes = await encode(canvas, ctx, img, [0, 0, x, y, w, h]);

  return { ...asset, bytes: newBytes };
};
