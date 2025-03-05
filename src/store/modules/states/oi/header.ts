import { OIPageEnum } from '@/enums/oiPageEnum';
import { store } from '@/store';
import { defineStore } from 'pinia';

export const useOIHeaderStore = defineStore({
  id: 'app-oi-header',
  state: (): any => ({
    _title: undefined as string | undefined,
  }),
  getters: {
    title: (state) => {
      if (state._title === undefined) {
        state._title = OIPageEnum.PRODUCTION;
      }
      return state._title;
    },
  },
  actions: {
    async setTitle(title: string) {
      this._title = title;
    },
  },
});

export function useOIHeaderStoreWithOut() {
  return useOIHeaderStore(store);
}
