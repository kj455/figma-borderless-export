import { parseCommand } from '../command';

describe('command', () => {
  test.each([
    [
      'export:jpg:1x,1.5x,2x',
      {
        action: 'export',
        properties: [
          { ext: 'jpg', scale: '1x', suffix: '' },
          { ext: 'jpg', scale: '1.5x', suffix: '@1.5x' },
          { ext: 'jpg', scale: '2x', suffix: '@2x' },
        ],
      },
    ],
    [
      'export:png:1x,1.5x,2x',
      {
        action: 'export',
        properties: [
          { ext: 'png', scale: '1x', suffix: '' },
          { ext: 'png', scale: '1.5x', suffix: '@1.5x' },
          { ext: 'png', scale: '2x', suffix: '@2x' },
        ],
      },
    ],
    ['export:svg:1x,1.5x,2x', null],
    ['showUI', { action: 'showUI', name: '' }],
  ])('parseCommand(%s)', (command, expected) => {
    expect(parseCommand(command)).toEqual(expected);
  });
});
