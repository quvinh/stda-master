import { IPagination } from '@/store/types/pagination';
import {
  searchProcessApi,
  createProcessApi,
  updateProcessApi,
  deleteProcessApi,
} from '@/api/sys/process';
import { store } from '@/store';
import { defineStore } from 'pinia';

import type { ErrorMessageMode } from '#/axios';
import { IProcess } from '@/api/model/IProcess';

export const useProcessStore = defineStore({
  id: 'app-process',
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
        return await searchProcessApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: create
     * @param payload
     */
    async create(
      payload: IProcess & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createProcessApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: update
     * @param payload
     */
    async update(
      payload: IProcess & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateProcessApi(params, mode);
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
        return await deleteProcessApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

export function useProcessStoreWithOut() {
  return useProcessStore(store);
}
