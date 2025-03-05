import { IPagination } from '@/store/types/pagination';
import {
  searchWarehouseApi,
  createWarehouseApi,
  updateWarehouseApi,
  deleteWarehouseApi,
  searchMaterialExportApi,
  searchMaterialImportApi,
  searchTPWareHouseReleaseApi,
  searchPalletByIdApi,
  searchNVLWareHouseReceiptDataApi,
  searchPalletsApi,
  searchWarehouseHistoryApi,
  createPalletApi,
  searchMaterialReceipt,
  searchMaterialReceiptItem,
  searchOIFinishedProductImportApi,
  searchOIFinishedProductImportsApi,
  exportExcelDataWarehouseApi,
  searchFinisehProductExportApi,
} from '@/api/sys/warehouse';
import { store } from '@/store';
import { defineStore } from 'pinia';

import type { ErrorMessageMode } from '#/axios';
import { IWarehouse } from '@/api/model/IWarehouse';
import { IPallet } from '@/api/model/IPallet';

export const useWarehouseStore = defineStore({
  id: 'app-warehouse',
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
        return await searchWarehouseApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchPalletByID(params: String): Promise<any | null> {
      try {
        return await searchPalletByIdApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchMaterialReceipt(params: any): Promise<any | null> {
      try {
        return await searchMaterialReceipt(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchMaterialReceiptItem(params: any): Promise<any | null> {
      try {
        return await searchMaterialReceiptItem(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchAllPallets(params: any): Promise<any | null> {
      try {
        return await searchPalletsApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchNVLWareHouseRelease(params: any): Promise<any | null> {
      try {
        return await searchMaterialExportApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchNVLWareHouseReceipt(params: any): Promise<any | null> {
      try {
        return await searchMaterialImportApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchNVLWareHouseReceiptData(params: any): Promise<any | null> {
      try {
        return await searchNVLWareHouseReceiptDataApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchFinisehProductExport(params: any): Promise<any | null> {
      try {
        return await searchFinisehProductExportApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchTPWareHouseRelease(params: any): Promise<any | null> {
      try {
        return await searchTPWareHouseReleaseApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchOIFinishedProductImportApi(params: any): Promise<any | null> {
      try {
        return await searchOIFinishedProductImportApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchOIFinishedProductImportsApi(params: any): Promise<any | null> {
      try {
        return await searchOIFinishedProductImportsApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async searchTPWareHouseExport(params: any): Promise<any | null> {
      try {
        return await searchWarehouseHistoryApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: create
     * @param payload
     */
    async create(
      payload: IWarehouse & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createWarehouseApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async createPallet(
      payload: IPallet & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await createPalletApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: update
     * @param payload
     */
    async update(
      payload: IWarehouse & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateWarehouseApi(params, mode);
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
        return await deleteWarehouseApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async export(params: any): Promise<any | null> {
      try {
        return await exportExcelDataWarehouseApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

export function useWarehouseStoreWithOut() {
  return useWarehouseStore(store);
}
