import { IPagination } from '@/store/types/pagination';
import {
  searchCustomerApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
  searchLogApi,
} from '@/api/sys/customer';
import { store } from '@/store';
import { defineStore } from 'pinia';

import type { ErrorMessageMode } from '#/axios';
import { ICustomer } from '@/api/model/ICustomer';

export const useCustomerStore = defineStore({
  id: 'app-customer',
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
        return await searchCustomerApi(params);
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
      payload: ICustomer & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createCustomerApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: update
     * @param payload
     */
    async update(
      payload: ICustomer & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateCustomerApi(params, mode);
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
        return await deleteCustomerApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

export function useCustomerStoreWithOut() {
  return useCustomerStore(store);
}
