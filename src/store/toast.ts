import { create } from "zustand";

interface ToastState {
  message: string | null;
  show: (msg: string) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return {
    message: null,
    show: (msg) => {
      if (timer) clearTimeout(timer);
      set({ message: msg });
      timer = setTimeout(() => set({ message: null }), 2500);
    },
    hide: () => set({ message: null }),
  };
});
