import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IWarehouse } from '../model/IWarehouse';
import { IPallet } from '../model/IPallet';
import { IFinishedProductExport } from '../model/IFinishedProductExport';
import { IFinishedProductImport } from '../model/IFinishedProductImport';

enum Api {
  Warehouses = '/warehouses',
  WarehousesId = '/warehouses/{id}',
  MaterialImports = '/warehouse/material-receipts', // material-import
  MaterialImport = '/material-receipts', // material-import
  MaterialExports = '/warehouse/material-export', // material-import
  MaterialImportId = '/material-receipts/{id}', // material-import
  MaterialExport = '/material-exports',
  MaterialExportId = '/material-exports/{id}',
  MaterialExportItem = '/material-export-items',
  MaterialExportItemPalletExport = '/material-export-items/pallet-export',
  TPWareHouseRelease = '/finished-product-exports',
  TPWareHouseReleaseId = '/finished-product-exports/{id}',
  OIFinishedProductImport = '/finished-product-imports',
  OIFinishedProductImportsItems = '/finished-product-import-items',
  WarehouseHistory = '/warehouse-histories',
  WarehouseHistories = '/warehouse/warehouse-histories',
  WarehouseHistoryInventory = '/warehouse-histories/inventory',
  NVLWareHouseExportData = '/finished-product-export-items',
  MaterialReceiptItem = '/material-receipt-items',
  PalletId = '/pallet/{id}',
  Pallets = '/pallets',
  ExportWarehouse = '/warehouses-export',
  // WarehouseInventory = '/warehouse-entries-inventory',
  // Export warehouse material
  ExportWarehouseMaterial1 = '/warehouse-histories-export/entry-summary',
  ExportWarehouseMaterial2 = '/warehouse-entries-export',
  Lots = '/lots/{id}',
  Lot = '/warehouse/lots/{id}',

  // Warehouse entry
  WarehouseEntry = '/warehouse-entries',
  WarehouseEntries = '/warehouse/warehouse-entries',
  LotWarehouseEntry = '/warehouse-entries/lot',
  WarehouseInventory = '/warehouses-inventory',
  FinishedProductInventory = '/warehouses-finished-product-inventory',
}

/**
 * @description: search
 */
export const searchWarehouseApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Warehouses,
    params: params,
  };
  return defHttp.get<IWarehouse>(config, { errorMessageMode: mode });
};

export const searchPalletsApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Pallets,
    params: params,
  };
  return defHttp.get<IPallet>(config, { errorMessageMode: mode });
};

export const searchPalletByIdApi = (params: String, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PalletId.replace('{id}', String('')),
    params: params,
  };
  return defHttp.get<IPallet>(config, { errorMessageMode: mode });
};

/**
 * @desciption list material export
 * @param params
 * @param mode
 * @returns
 */
export const searchMaterialExportApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialExport,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

/**
 * @desciption list material export item
 * @param params
 * @param mode
 * @returns
 */
export const searchMaterialExportItemApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialExportItem,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const getMaterialExportItemPalletExportApi = (id: number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialExportItemPalletExport + `/${id}`,
  };
  return defHttp.get<any>(config);
};

// ===============MATERIAL IMPORT=============================
/**
 * @description search material imoprt
 * @param params
 * @param mode
 * @returns
 */
export const searchMaterialImportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialImport,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const searchMaterialReceipt = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialImport,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const searchMaterialReceiptItem = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const pm = {
    material_receipt_id: params,
  };
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialReceiptItem,
    params: pm,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

/**
 * @description create material import
 * @param params
 * @param mode
 * @returns
 */
export const createMaterialImportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialImports,
    params: params,
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};

export const createProductImportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.OIFinishedProductImportsItems,
    params: params,
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};

export const createMaterialExportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialExports,
    params: params,
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};

export const createTPExportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.TPWareHouseRelease,
    params: params,
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};

/**
 * @description update material import
 * @param params
 * @param mode
 * @returns
 */
export const updateMaterialImportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  if (!params.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialImportId.replace('{id}', String(params.id)),
    params: params,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};

export const updateMaterialExportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  if (!params.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialExportId.replace('{id}', String(params.id)),
    params: params,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};

export const updateTPExportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  if (!params.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.TPWareHouseReleaseId.replace('{id}', String(params.id)),
    params: params,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};

/**
 * @description delete material import
 * @param id
 * @returns
 */
export const deleteMaterialImportApi = (id: string | number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialImportId.replace('{id}', String(id)),
  };
  return defHttp.delete<any>(config);
};

export const deleteMaterialExportApi = (id: string | number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialExportId.replace('{id}', String(id)),
  };
  return defHttp.delete<any>(config);
};

export const deleteTPExportApi = (id: string | number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.TPWareHouseReleaseId.replace('{id}', String(id)),
  };
  return defHttp.delete<any>(config);
};

export const searchNVLWareHouseReceiptDataApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.TPWareHouseRelease,
    params: params,
  };
  return defHttp.get<IFinishedProductExport>(config, { errorMessageMode: mode });
};

export const searchFinisehProductExportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.NVLWareHouseExportData,
    params: params,
  };
  return defHttp.get<IFinishedProductExport>(config, { errorMessageMode: mode });
};

export const searchTPWareHouseReleaseApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.TPWareHouseRelease,
    params: params,
  };
  return defHttp.get<IWarehouse>(config, { errorMessageMode: mode });
};

export const searchOIFinishedProductImportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.OIFinishedProductImport,
    params: params,
  };
  return defHttp.get<IWarehouse>(config, { errorMessageMode: mode });
};

export const searchOIFinishedProductImportsApi = (
  params: any,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.OIFinishedProductImportsItems,
    params: params,
  };
  return defHttp.get<IWarehouse>(config, { errorMessageMode: mode });
};

export const searchWarehouseHistoryApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseHistory,
    params: params,
  };
  return defHttp.get<IFinishedProductImport>(config, { errorMessageMode: mode });
};

export const searchWarehouseInventory = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseInventory,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const searchFinishedProductInventory = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.FinishedProductInventory,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const searchInventory = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseHistoryInventory,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createWarehouseApi = (payload: IWarehouse, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Warehouses,
    params: payload,
  };
  return defHttp.post<IWarehouse | any>(config, { errorMessageMode: mode });
};

export const createPalletApi = (payload: IPallet, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Pallets,
    params: payload,
  };
  console.log('payload = ', payload);
  return defHttp.post<IPallet | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateWarehouseApi = (payload: IWarehouse, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehousesId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IWarehouse>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteWarehouseApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehousesId.replace('{id}', String(id)),
  };
  return defHttp.delete<IWarehouse>(config, { errorMessageMode: mode });
};

export const exportExcelDataWarehouseApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportWarehouse,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

/**
 * @description báo cáo nhập kho nguyên vật liệu
 */
export const exportExcelMaterial1Data = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportWarehouseMaterial1,
  };
  return defHttp.get<any>(config);
};

/**
 * @description xuất file tồn kho nguyên vật liệu
 */
export const exportExcelMaterial2Data = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportWarehouseMaterial2,
    params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description lưu tồn kho
 */
export const createWarehouseEntry = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseEntries,
    params,
  };
  return defHttp.post<any>(config);
};

export const createLotWarehouseEntry = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.LotWarehouseEntry,
    params,
  };
  return defHttp.post<any>(config);
};

/**
 * @description tồn kho
 */
export const searchWarehouseEntry = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseEntries,
    params,
  };
  return defHttp.get<any>(config);
};

export const searchLots = (id: number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Lot.replace('{id}', String(id)),
  };
  return defHttp.get<any>(config);
};

export const searchLot = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseEntry,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description lưu lịch sử kho
 */
export const createWarehouseHistory = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseHistories,
    params,
  };
  return defHttp.post<any>(config);
};
