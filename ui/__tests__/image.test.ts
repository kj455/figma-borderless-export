import { describe, expect, test } from 'vitest';
import {
  calcGray,
  getPixel,
  getPixelGray,
  hasBorder,
  isTransparent,
} from '../image';
import { Pixel } from '../types';

const createImageData = (
  option: Partial<{ width: number; height: number; data: number[] }>
) =>
  ({
    width: option.width ?? 0,
    height: option.height ?? 0,
    data: new Uint8ClampedArray(option.data ?? []),
    colorSpace: 'srgb',
  } as ImageData);

const createPixel = (p: Pixel) => p;

describe('image', () => {
  const image = createImageData({
    data: [
      ...[0, 0, 0, 255],
      ...[1, 1, 1, 255],
      ...[2, 2, 2, 255],
      ...[3, 3, 3, 255],
    ],
    width: 2,
    height: 2,
  });

  test.each([
    { image, x: 0, y: 0, expected: [0, 0, 0, 255] },
    { image, x: 1, y: 1, expected: [3, 3, 3, 255] },
    { image, x: 2, y: 2, expected: null },
    { image, x: -1, y: -1, expected: null },
  ])('getPixel($x, $y) = $expected', ({ x, y, image, expected }) => {
    expect(getPixel(image, x, y)).toEqual(expected);
  });

  test.each([
    { image, x: 0, y: 0, expected: 0 },
    { image, x: 1, y: 1, expected: 3 },
    { image, x: 2, y: 2, expected: null },
    { image, x: -1, y: -1, expected: null },
  ])('getPixelGray($x, $y) = $expected', ({ x, y, image, expected }) => {
    expect(getPixelGray(image, x, y)).toEqual(expected);
  });

  test.each([
    [createPixel([0, 0, 0, 0]), 0],
    [createPixel([0, 0, 0, 255]), 0],
    [createPixel([255, 255, 255, 255]), 255],
    [createPixel([255, 255, 255, 0]), 255],
    [createPixel([255, 0, 0, 255]), 76],
    [createPixel([0, 255, 0, 255]), 150],
    [createPixel([0, 0, 255, 255]), 29],
  ])('calcGray(%s) = %d', (p, expected) => {
    expect(calcGray(p)).toBe(expected);
  });

  test.each([
    [createPixel([0, 0, 0, 0]), true],
    [createPixel([0, 0, 0, 128]), true],
    [createPixel([0, 0, 0, 129]), false],
    [createPixel([0, 0, 0, 255]), false],
  ])(`isTransparent(%s) = %s`, (p, expected) => {
    expect(isTransparent(p)).toBe(expected);
  });

  // gray value to pixel array
  const g2p = (g: number) => [g, g, g, 255];

  test.each([
    [
      'left' as const,
      'no border - 3*3',
      createImageData({
        data: [
          ...[...g2p(112), ...g2p(118), ...g2p(225)],
          ...[...g2p(152), ...g2p(216), ...g2p(222)],
          ...[...g2p(200), ...g2p(210), ...g2p(214)],
        ],
        width: 3,
        height: 3,
      }),
      false,
    ],
    [
      'left' as const,
      'black border - 3*3',
      createImageData({
        data: [
          ...[...g2p(10), ...g2p(118), ...g2p(125)],
          ...[...g2p(20), ...g2p(116), ...g2p(122)],
          ...[...g2p(10), ...g2p(110), ...g2p(114)],
        ],
        width: 3,
        height: 3,
      }),
      true,
    ],
    [
      'left' as const,
      'white border - 3*3',
      createImageData({
        data: [
          ...[...g2p(245), ...g2p(148), ...g2p(225)],
          ...[...g2p(251), ...g2p(156), ...g2p(222)],
          ...[...g2p(249), ...g2p(160), ...g2p(214)],
        ],
        width: 3,
        height: 3,
      }),
      true,
    ],
    [
      'left' as const,
      'no border - 3*5',
      createImageData({
        data: [
          ...[...g2p(215), ...g2p(218), ...g2p(253)],
          ...[...g2p(231), ...g2p(253), ...g2p(253)],
          ...[...g2p(222), ...g2p(253), ...g2p(222)],
          ...[...g2p(250), ...g2p(256), ...g2p(222)],
          ...[...g2p(253), ...g2p(250), ...g2p(214)],
        ],
        width: 3,
        height: 5,
      }),
      false,
    ],
  ])('hasBorder(%s) - %s', (dir, _, image, expected) => {
    expect(hasBorder(image, dir)).toBe(expected);
  });
});
