import { parseCommand } from '../command';

describe('command', () => {
  test.each([
    ['jpg:1x,1.5x,2x', { ext: 'jpg', scaleList: ['1x', '1.5x', '2x'] }],
    ['png:1x,1.5x,2x', { ext: 'png', scaleList: ['1x', '1.5x', '2x'] }],
    ['jpg:1x', { ext: 'jpg', scaleList: ['1x'] }],
    ['png:1.5x', { ext: 'png', scaleList: ['1.5x'] }],
    ['svg:2x', { ext: null, scaleList: null }],
    ['gif:2x', { ext: null, scaleList: null }],
  ])('parseCommand(%s)', (command, expected) => {
    expect(parseCommand(command)).toEqual(expected);
  });
});
