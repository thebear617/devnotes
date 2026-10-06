export const BOARD_DEFINITIONS = [
  { id: 'knowledge', name: '知识库', path: 'knowledge/' },
  { id: 'notes', name: 'Debug 库', path: 'notes/' },
  { id: 'timeline', name: '开发时间线', path: 'timeline/' },
];

export function getBoardNav(base = '/') {
  return BOARD_DEFINITIONS.map((board) => ({
    ...board,
    href: `${base}${board.path}`,
  }));
}
