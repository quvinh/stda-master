import { createApi, deleteApi, searchApi, updateApi } from '@/api/sys/acceptance-quality-limit';
import { store } from '@/store';
import { defineStore } from 'pinia';

import type { ErrorMessageMode } from '#/axios';
import { IAcceptanceQualityLimit } from '@/api/model/IAcceptanceQualityLimit';

export const useAcceptanceQualityLimitStore = defineStore({
  id: 'app-acceptance-quality-limit',
  state: (): any => ({}),
  getters: {},
  actions: {
    /**
     * @description: search
     */
    async search(params: any): Promise<any | null> {
      try {
        return await searchApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: create
     * @param payload
     */
    async create(
      payload: IAcceptanceQualityLimit & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: update
     * @param payload
     */
    async update(
      payload: IAcceptanceQualityLimit & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateApi(params, mode);
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
        return await deleteApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

export function useAcceptanceQualityLimitStoreWithOut() {
  return useAcceptanceQualityLimitStore(store);
}
