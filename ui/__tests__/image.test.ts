import { describe, expect, test } from 'vitest';
import { calcGray, hasBorder } from '../image';

describe('image', () => {
  test.each([
    [0, 0, 0, 0],
    [255, 0, 0, 76],
    [0, 255, 0, 150],
    [0, 0, 255, 29],
    [100, 100, 100, 100],
    [255, 255, 255, 255],
    [86, 118, 151, 112],
    [92, 124, 155, 118],
    [98, 131, 161, 125],
    [85, 118, 153, 112],
    [89, 122, 155, 116],
    [95, 129, 158, 122],
    [80, 113, 148, 107],
    [83, 116, 149, 110],
    [87, 121, 151, 114],
  ])('calcGray(%d, %d, %d) = %d', (r, g, b, expected) => {
    expect(calcGray(r, g, b)).toBe(expected);
  });

  // gray value to pixel array
  const g2p = (g: number) => [g, g, g, 255];

  test.each([
    [
      'left',
      'no border - 3*3',
      {
        data: [
          ...[...g2p(112), ...g2p(118), ...g2p(225)],
          ...[...g2p(152), ...g2p(216), ...g2p(222)],
          ...[...g2p(200), ...g2p(210), ...g2p(214)],
        ],
        width: 3,
        height: 3,
      },
      false,
    ],
    [
      'left',
      'black border - 3*3',
      {
        data: [
          ...[...g2p(10), ...g2p(118), ...g2p(125)],
          ...[...g2p(20), ...g2p(116), ...g2p(122)],
          ...[...g2p(10), ...g2p(110), ...g2p(114)],
        ],
        width: 3,
        height: 3,
      },
      true,
    ],
    [
      'left',
      'white border - 3*3',
      {
        data: [
          ...[...g2p(245), ...g2p(148), ...g2p(225)],
          ...[...g2p(251), ...g2p(156), ...g2p(222)],
          ...[...g2p(249), ...g2p(160), ...g2p(214)],
        ],
        width: 3,
        height: 3,
      },
      true,
    ],
    [
      'left',
      'no border - 3*5',
      {
        data: [
          ...[...g2p(215), ...g2p(218), ...g2p(253)],
          ...[...g2p(231), ...g2p(253), ...g2p(253)],
          ...[...g2p(222), ...g2p(253), ...g2p(222)],
          ...[...g2p(250), ...g2p(256), ...g2p(222)],
          ...[...g2p(253), ...g2p(250), ...g2p(214)],
        ],
        width: 3,
        height: 5,
      },
      false,
    ],
  ])('hasBorder(%s) - %s', (dir, _, image, expected) => {
    expect(hasBorder(image as any, dir as any)).toBe(expected);
  });
});
