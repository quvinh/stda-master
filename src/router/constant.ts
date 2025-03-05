export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const EXCEPTION_COMPONENT = () => import('@/views/sys/exception/Exception.vue');

/**
 * @description: default layout
 */
export const LAYOUT = () => import('@/layouts/default/index.vue');

/**
 * @description: OI layout
 */
export const OI_LAYOUT = () => import('@/layouts/oi-layout/index.vue');
export const OI_LAYOUT_MENU = () => import('@/layouts/oi-layout/menu.vue');

/**
 * @description: module layout
 */
export const MODULE_LAYOUT = () => import('@/layouts/module-layout/index.vue');

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: _name || PARENT_LAYOUT_NAME,
      });
    });
};
