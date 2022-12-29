import { parseCommand } from '../command';

describe('command', () => {
  test.each([
    ['export:jpg:1x,1.5x,2x', { action: 'export', ext: 'jpg', scaleList: ['1x', '1.5x', '2x'] }],
    ['export:png:1x,1.5x,2x', { action: 'export', ext: 'png', scaleList: ['1x', '1.5x', '2x'] }],
    ['export:jpg:1x', { action: 'export', ext: 'jpg', scaleList: ['1x'] }],
    ['export:png:1.5x', { action: 'export', ext: 'png', scaleList: ['1.5x'] }],
    ['export:svg:2x', { action: 'export', ext: null, scaleList: null }],
    ['export:gif:2x', { action: 'export', ext: null, scaleList: null }],
    ['showUI', { action: 'showUI' }],
  ])('parseCommand(%s)', (command, expected) => {
    expect(parseCommand(command)).toEqual(expected);
  });
});
