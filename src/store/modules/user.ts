import type { UserInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import { PERMISSIONS_KEY, ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { GetUserInfoModel, LoginParams } from '@/api/sys/model/userModel';
import {
  doLogout,
  getUserInfo,
  loginApi,
  searchApi,
  updateUserInfoApi,
  createApi,
  deleteApi,
} from '@/api/sys/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { isArray } from '@/utils/is';
import { h } from 'vue';
import { PermissionEnum } from '@/enums/permissionEnum';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  permissionList: PermissionEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // permissionList
    permissionList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getPermissionList(state): PermissionEnum[] {
      return state.permissionList.length > 0
        ? state.permissionList
        : getAuthCache<PermissionEnum[]>(PERMISSIONS_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setPermissionList(permissionList: PermissionEnum[]) {
      this.permissionList = permissionList;
      setAuthCache(PERMISSIONS_KEY, permissionList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.permissionList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const uiLayout = params.layout === 'ui';
        const { goHome = uiLayout, mode, ...loginParams } = params;
        const result = await loginApi(loginParams, mode);
        const { token_type, access_token } = result;
        console.log('res = ', result);
        // save token
        this.setToken(`${token_type} ${access_token}`);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          permissionStore.setDynamicAddedRoute(true);
        }

        // goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
        if (goHome) await router.replace(userInfo?.homePath || PageEnum.BASE_HOME);
        else await router.replace(userInfo?.homePath || PageEnum.OI_PAGE);
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      try {
        if (!this.getToken) return null;
        const userInfo = await getUserInfo();
        const { permissions = [] } = userInfo;
        // if (isArray(roles)) {
        //   const roleList = roles.map((item) => item.value) as RoleEnum[];
        //   this.setRoleList(roleList);
        // } else {
        //   userInfo.roles = [];
        //   this.setRoleList([]);
        // }
        if (isArray(permissions)) {
          const permissionList = permissions.map((item) => item.slug) as PermissionEnum[];
          this.setPermissionList(permissionList);
        } else {
          userInfo.permissions = [];
          this.setRoleList([]);
        }
        this.setUserInfo(userInfo);
        return userInfo;
      } catch (error) {
        await this.logout(true);
        return null;
      }
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('Failed to cancel the token');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      if (goLogin) {
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },

    async update(
      payload: any & {
        mode?: ErrorMessageMode;
      },
    ): Promise<any | null> {
      try {
        const { mode, ...params } = payload;
        return await updateUserInfoApi(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async getUser(): Promise<any | null> {
      try {
        return await getUserInfo();
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async search(params: any): Promise<any | null> {
      try {
        return await searchApi(params);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async create(
      payload: any & {
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

    async delete(id: number): Promise<any | null> {
      try {
        return await deleteApi(id);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
