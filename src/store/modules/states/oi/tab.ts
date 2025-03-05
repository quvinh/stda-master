import { defineStore } from 'pinia';
import { store } from '@/store';

export const useTabStore = defineStore({
  id: 'tab',
  state: () => ({
    processSelected: null,
    equipmentSelected: null,
  }),
  actions: {
    setProcessSelected(value: any) {
      this.processSelected = value;
    },
    setEquipmentSelected(value: any) {
      this.equipmentSelected = value;
    },
  },
  getters: {
    getProcessSelected: (state) => state.processSelected,
    getEquipmentSelected: (state) => state.equipmentSelected,
  },
});

export function tabStore() {
  return useTabStore(store);
}
