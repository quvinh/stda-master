import { IBoms } from './../../../api/model/IBoms';
import { IPagination } from '@/store/types/pagination';
import {
  searchBomApi,
  createBomApi,
  updateBomApi,
  deleteBomApi,
  searchLogApi,
} from '@/api/sys/boms';
import { store } from '@/store';
import { defineStore } from 'pinia';

import type { ErrorMessageMode } from '#/axios';

export const useBomsStore = defineStore({
  id: 'app-boms',
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
        return await searchBomApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchLog(params: any): Promise<any | null> {
      try {
        return await searchLogApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: create
     * @param payload
     */
    async create(
      payload: IBoms & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createBomApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: update
     * @param payload
     */
    async update(
      payload: IBoms & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateBomApi(params, mode);
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
        return await deleteBomApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

export function useCustomerStoreWithOut() {
  return useBomsStore(store);
}
