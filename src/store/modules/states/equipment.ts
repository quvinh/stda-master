import { IEquipment } from '@/api/model/IEquipment';
import { IPagination } from '@/store/types/pagination';
import {
  searchEquipmentApi,
  createEquipmentApi,
  updateEquipmentApi,
  deleteEquipmentApi,
  printTemplteApi,
} from '@/api/sys/equipment';
import { store } from '@/store';
import { defineStore } from 'pinia';

import type { ErrorMessageMode } from '#/axios';

export const useEquipmentStore = defineStore({
  id: 'app-equipment',
  state: (): any => ({
    _list: undefined as any[] | undefined,
    _pagination: undefined as IPagination | undefined,
  }),
  getters: {
    list: (state) => {
      if (state._list === undefined) {
        state._list = [];
      }
      return state._list;
    },
    pagination: (state) => {
      if (state._pagination === undefined) {
        state._pagination = {} as IPagination;
      }
      return state._pagination;
    },
  },
  actions: {
    /**
     * @description: search
     */
    async search(params: any): Promise<any | null> {
      try {
        return await searchEquipmentApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: create
     * @param payload
     */
    async create(
      payload: IEquipment & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createEquipmentApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: update
     * @param payload
     */
    async update(
      payload: IEquipment & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateEquipmentApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: delete
     * @param id
     */
    async delete(id: number): Promise<any | null> {
      try {
        return await deleteEquipmentApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async printTemplte(equipment_id: IEquipment['id']): Promise<any | null> {
      try {
        return await printTemplteApi(equipment_id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

export function useEquipmentStoreWithOut() {
  return useEquipmentStore(store);
}
