<!--
 Access control component for fine-grained access control.
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { RoleEnum } from '@/enums/roleEnum';
  import { usePermission } from '@/hooks/web/usePermission';
  import { getSlot } from '@/utils/helper/tsxHelper';
  import { PermissionEnum } from '@/enums/permissionEnum';

  export default defineComponent({
    name: 'Authority',
    props: {
      /**
       * Specified role is visible
       * When the permission mode is the role mode, the value value can pass the role value.
       * When the permission mode is background, the value value can pass the code permission value
       * @default ''
       */
      value: {
        type: [Number, Array, String] as PropType<
          PermissionEnum | PermissionEnum[] | RoleEnum | RoleEnum[] | string | string[]
        >,
        default: '',
      },
    },
    setup(props, { slots }) {
      const { hasPermission } = usePermission();

      /**
       * Render role button
       */
      function renderAuth() {
        const { value } = props;
        if (!value) {
          return getSlot(slots);
        }
        return hasPermission(value) ? getSlot(slots) : null;
      }

      return () => {
        // Role-based value control
        return renderAuth();
      };
    },
  });
</script>
