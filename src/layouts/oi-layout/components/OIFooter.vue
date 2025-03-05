<template>
  <footer
    class="oi-bg-blue text-white p-3 text-center fixed bottom-0 left-0 w-full z-10 flex justify-around oi-footer"
  >
    <a
      v-for="link in links"
      :key="link.name"
      @click="() => handleRedirect(link)"
      :class="`select-none hover:text-gray-300 transition-opacity duration-300 text-white font-size-4 flex justify-between items-center gap-1 ${routeName === link.path ? 'font-500' : 'opacity-60'}`"
    >
      <Icon :icon="link.icon" size="20" />
      <span>{{ link.label }}</span>
    </a>
  </footer>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { useGo } from '@/hooks/web/usePage';
  import { OIPageEnum } from '@/enums/oiPageEnum';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  interface ILink {
    header: string;
    name: string;
    label: string;
    icon: string;
    path: string;
  }

  const route = useRoute();
  const go = useGo();
  const oiHeaderStore = useOIHeaderStore();
  const routeName = ref<string>('production');
  const links = ref<ILink[]>([
    {
      header: OIPageEnum.PRODUCTION,
      name: 'production',
      label: 'Sản xuất',
      icon: 'ant-design:product-outlined',
      path: '/oi/production',
    },
    {
      header: OIPageEnum.QUALITY,
      name: 'quality',
      label: 'Chất lượng',
      icon: 'material-symbols:kid-star-outline-sharp',
      path: '/oi/quality-dd',
    },
    {
      header: OIPageEnum.EQUIPMENT,
      name: 'equipment',
      label: 'Thiết bị',
      icon: 'solar:settings-linear',
      path: '/oi/equipment',
    },
    {
      header: OIPageEnum.WAREHOUSE,
      name: 'warehouse',
      label: 'Kho',
      icon: 'streamline:warehouse-1',
      path: '/oi/warehouse',
    },
    // Add route here
  ]);

  /**
   * Redirect and update store
   * @param path
   */
  async function handleRedirect(data: ILink) {
    if (oiHeaderStore.title !== data.path) {
      await oiHeaderStore.setTitle(data.header);
    }
    go(data.path);
  }

  onMounted(() => {
    routeName.value = route.path;
    const findPath: ILink | undefined = links.value.find((item) => item.path === route.path);
    if (findPath) {
      oiHeaderStore.setTitle(findPath.header);
    }
  });

  watch(
    () => route.path,
    (newPath) => {
      routeName.value = newPath;
    },
  );
</script>
