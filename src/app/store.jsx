import create from "zustand";

export const defaultState = {
  drag: [0, 0],
  dragging: false,
};

export const useStore = create((set) => ({
  ...defaultState,
  resetState: () => set(defaultState),
}));
