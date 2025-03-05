import { ErrorMessageMode } from '#/axios';
import { IProduct } from '@/api/model/IProduct';
import {
  createProductApi,
  deleteProductApi,
  searchProductApi,
  updateProductApi,
} from '@/api/sys/product';
import { store } from '@/store';
import { IPagination } from '@/store/types/pagination';
import { defineStore } from 'pinia';

export const useProductStore = defineStore({
  id: 'app-product',
  state: (): any => ({
    _list: undefined as any[] | undefined,
    _pagination: undefined as IPagination | undefined,
  }),
  getters: {
    list: (state) => {
      if (state.list === undefined) state._list = [];
      return state._list;
    },
    pagination: (state) => {
      if (state._pagination === undefined) state._pagination = {} as IPagination;
      return state._pagination;
    },
  },
  actions: {
    //search
    async search(params: any): Promise<any | null> {
      try {
        return await searchProductApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    //create
    async create(
      payload: IProduct & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createProductApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    //update
    async update(
      payload: IProduct & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateProductApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    //delete
    async delete(id: number): Promise<any | null> {
      try {
        return await deleteProductApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

export const useProductStoreWithOut = () => {
  return useProductStore(store);
};
