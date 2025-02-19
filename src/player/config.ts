export enum PLAY_PANEL_SIZE {
    V= '1',
    H= '2'
}

export const getPanelSizeOptions = () => [
  {
    label: '16:9',
    value: PLAY_PANEL_SIZE.V,
    width: 16,
    height: 9,
  },
  {
    label: '9:16',
    value: PLAY_PANEL_SIZE.H,
    width: 9,
    height: 16,
  },
];
