import { IPagination } from '@/store/types/pagination';
import {
  searchProductCategoryApi,
  createProductCategoryApi,
  updateProductCategoryApi,
  deleteProductCategoryApi,
} from '@/api/sys/product-category';
import { store } from '@/store';
import { defineStore } from 'pinia';

import type { ErrorMessageMode } from '#/axios';
import { IProductCategory } from '@/api/model/IProductCategory';

export const useProductCategoryStore = defineStore({
  id: 'app-product-category',
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
        return await searchProductCategoryApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: create
     * @param payload
     */
    async create(
      payload: IProductCategory & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createProductCategoryApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: update
     * @param payload
     */
    async update(
      payload: IProductCategory & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateProductCategoryApi(params, mode);
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
        return await deleteProductCategoryApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

export function useProductCategoryStoreWithOut() {
  return useProductCategoryStore(store);
}
