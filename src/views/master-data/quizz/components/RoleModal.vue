<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    okText="Lưu lại"
    cancelText="Thoát"
    style="top: 10px"
  >
    <Form ref="formRef" class="h-70vh" :model="formData" layout="vertical" @submit="handleSubmit">
      <Row :gutter="[5, 5]">
        <Col :span="12">
          <FormItem
            label="Slug"
            name="slug"
            :rules="[{ required: true, message: 'Vui lòng nhập' }]"
          >
            <Input v-model:value="formData.slug" placeholder="Vui lòng nhập" />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem
            label="Tên chức vụ"
            name="name"
            :rules="[{ required: true, message: 'Vui lòng nhập' }]"
          >
            <Input v-model:value="formData.name" placeholder="Nhập tên chức vụ" />
          </FormItem>
        </Col>
        <!-- <Col :span="12">
          <FormItem
            label="Tên phòng ban"
            name="department_id"
            :rules="[{ required: true, message: 'Vui lòng nhập' }]"
          >
            <Select v-model="formData.department" :options="[]" placeholder="Chọn tên phòng ban" />
          </FormItem>
        </Col> -->
        <Col :span="24">
          <Divider orientation="center" style="margin-top: 5px; margin-bottom: 0"
            >Master Data</Divider
          >
          <Row :gutter="[8, 8]" class="font-bold border-b-gray border-b">
            <Col
              :span="8"
              class="cursor-pointer transition-colors duration-300 hover:bg-blue-200 p-1"
              @click="handleCheckAllMasterData"
            >
              <Icon icon="ant-design:check-square-outlined" />
              <span>Quyền hạn (Đã chọn: {{ countMasterData }})</span>
            </Col>
            <Col :span="4" class="p-1">
              <div class="cursor-pointer" @click="() => handleColChecked('search')">Xem</div>
            </Col>
            <Col :span="4" class="p-1">
              <div class="cursor-pointer" @click="() => handleColChecked('create')">Thêm</div>
            </Col>
            <Col :span="4" class="p-1">
              <div class="cursor-pointer" @click="() => handleColChecked('update')">Sửa</div>
            </Col>
            <Col :span="4" class="p-1">
              <div class="cursor-pointer" @click="() => handleColChecked('delete')">Xóa</div>
            </Col>
          </Row>
          <div class="h-45 overflow-y-scroll">
            <Checkbox.Group class="w-full" v-model:value="permissionChecked">
              <Row>
                <Col :span="24">
                  <template
                    v-for="(slug, index) in getSlugMasterData(permissionOptions)"
                    :key="index"
                  >
                    <Row :id="index">
                      <Col :span="8"
                        ><div
                          class="content-item"
                          @click="() => handleSlugParentMasterDataClick(slug)"
                          >{{ translateSlugMasterData(slug) }}</div
                        ></Col
                      >
                      <Col :span="4">
                        <Checkbox :value="`${slug}.search`"><EyeOutlined /></Checkbox>
                      </Col>
                      <Col :span="4">
                        <Checkbox :value="`${slug}.create`"><PlusOutlined /></Checkbox>
                      </Col>
                      <Col :span="4">
                        <Checkbox :value="`${slug}.update`"><EditOutlined /></Checkbox>
                      </Col>
                      <Col :span="4">
                        <Checkbox :value="`${slug}.delete`"><DeleteOutlined /></Checkbox>
                      </Col>
                    </Row>
                  </template>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>

          <Divider orientation="center" style="margin-top: 5px; margin-bottom: 0">UI</Divider>
          <Button size="small" @click="handleCheckAllUI"
            ><CheckSquareOutlined /> Chọn tất cả</Button
          >
          <Checkbox.Group v-model:value="uiPermissionChecked">
            <Row>
              <Col
                :span="6"
                v-for="(row, index) in getSlugView(permissionOptions, 'ui')"
                :key="index"
                index
              >
                <Checkbox :value="row.value">{{ row.name }}</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>

          <Divider orientation="center" style="margin-top: 5px; margin-bottom: 0">OI</Divider>
          <Button size="small" @click="handleCheckAllOI"
            ><CheckSquareOutlined /> Chọn tất cả</Button
          >
          <Checkbox.Group v-model:value="oiPermissionChecked">
            <Row>
              <Col
                :span="6"
                v-for="(row, index) in getSlugView(permissionOptions, 'oi')"
                :key="index"
                index
              >
                <Checkbox :value="row.value">{{ row.name }}</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Col>
      </Row>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    CheckSquareOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
  } from '@ant-design/icons-vue';
  import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    FormItem,
    Input,
    message,
    Row,
    // Select,
  } from 'ant-design-vue';
  import { computed, reactive, ref, unref } from 'vue';
  import { getSlugMasterData, getSlugView, translateSlugMasterData } from './tableData';
  import { createRoleApi, updateRoleApi } from '@/api/sys/role';
  import { searchPermissionApi } from '@/api/sys/permission';

  const isUpdate = ref<boolean>(true);
  const record = ref<any>({});
  const formRef = ref();
  const emit = defineEmits(['success']);
  const countMasterData = ref<number>(0);

  const formData = reactive<any>({
    slug: '',
    name: '',
    // department_id: '',
  });

  // const departmentOptions = ref<ISelectOption[]>([]);
  const permissionOptions = ref<{ label: string; value: string | number; name: string }[]>([]);
  const permissionChecked = ref<any[]>([]);
  const uiPermissionChecked = ref<any[]>([]);
  const oiPermissionChecked = ref<any[]>([]);

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    await fetchPermission();
    // await fetchDepartment();
    isUpdate.value = !!data?.isUpdate;
    if (isUpdate.value) {
      const { slug, name } = data.record;
      record.value = data.record;
      formData.slug = slug ?? '';
      formData.name = name ?? '';
      loadRolePermissions(data.record);
    } else {
      permissionChecked.value = [];
      uiPermissionChecked.value = [];
      oiPermissionChecked.value = [];
      formData.slug = '';
      formData.name = '';
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  function loadRolePermissions(record: any) {
    permissionChecked.value =
      record?.permissions
        ?.filter(
          ({ slug }) =>
            String(slug).endsWith('.search') ||
            String(slug).endsWith('.create') ||
            String(slug).endsWith('.update') ||
            String(slug).endsWith('.delete'),
        )
        .map(({ slug }) => slug) || [];
    uiPermissionChecked.value = record?.permissions
      .filter(({ slug }) => String(slug).startsWith('ui.'))
      .map((item) => item.id);
    oiPermissionChecked.value = record?.permissions
      .filter(({ slug }) => String(slug).startsWith('oi.'))
      .map((item) => item.id);
  }

  async function fetchPermission() {
    const res: any = await searchPermissionApi();
    permissionOptions.value = (res?.data || []).map(({ id, slug, name }) => ({
      label: slug,
      value: id,
      name,
    }));
  }

  // async function fetchDepartment() {
  //   const res: any = await searchDepartmentApi();
  //   console.log(res);
  //   departmentOptions.value = res?.data || [];
  // }

  const getTitle = computed(() => (!unref(isUpdate) ? 'Thêm chức vụ' : 'Chỉnh sửa chức vụ'));

  async function handleSubmit() {
    const form = unref(formRef);
    const values = await form.validate();
    try {
      const permissionIds = permissionOptions.value
        .filter((item) => permissionChecked.value.includes(item.label))
        .map(({ value }) => value);
      console.log(
        values,
        permissionChecked.value,
        uiPermissionChecked.value,
        oiPermissionChecked.value,
      );
      setModalProps({ loading: true, confirmLoading: true });
      if (!unref(isUpdate)) {
        // Force create
        const res = await createRoleApi({
          ...values,
          permission_id: [
            ...permissionIds,
            ...uiPermissionChecked.value,
            ...oiPermissionChecked.value,
          ],
        });
        if (res) {
          message.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        }
      } else {
        // Force update
        const res = await updateRoleApi({
          ...values,
          id: record.value?.id,
          permission_id: [
            ...permissionIds,
            ...uiPermissionChecked.value,
            ...oiPermissionChecked.value,
          ],
        });
        if (res) {
          message.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  function handleSlugParentMasterDataClick(value) {
    const perms = permissionOptions.value.filter((item) =>
      String(item.label).startsWith(`${value}.`),
    );
    console.log(perms);
    const permChecked = perms.filter(({ label: v }) => {
      if (permissionChecked.value.includes(v)) return true;
      return false;
    });

    if (permChecked.length === perms.length) {
      const newPerm: any[] = permissionChecked.value.filter((val) => {
        if (perms.filter((item) => item.label === val).length > 0) return false;
        return true;
      });
      permissionChecked.value = newPerm;
    } else if (permChecked.length > 0) {
      const newPerm = perms.filter((item) => !permissionChecked.value.includes(item.label));
      permissionChecked.value = [...permissionChecked.value, ...newPerm.map((item) => item.label)];
    } else {
      permissionChecked.value = [...permissionChecked.value, ...perms.map((item) => item.label)];
    }
    console.log(permissionChecked.value);
  }

  function handleCheckAllMasterData() {
    if (permissionChecked.value.length > 0) {
      permissionChecked.value = [];
      countMasterData.value = 0;
    } else
      permissionChecked.value = permissionOptions.value
        .filter(
          ({ label }) =>
            String(label).endsWith('.search') ||
            String(label).endsWith('.create') ||
            String(label).endsWith('.update') ||
            String(label).endsWith('.delete'),
        )
        .map((item) => {
          countMasterData.value++;
          return item.label;
        });
  }

  function handleCheckAllUI() {
    if (uiPermissionChecked.value.length > 0) uiPermissionChecked.value = [];
    else
      uiPermissionChecked.value = permissionOptions.value
        .filter(({ label }) => String(label).startsWith('ui.'))
        .map((item) => item.value);
  }

  function handleCheckAllOI() {
    if (oiPermissionChecked.value.length > 0) oiPermissionChecked.value = [];
    else
      oiPermissionChecked.value = permissionOptions.value
        .filter(({ label }) => String(label).startsWith('oi.'))
        .map((item) => item.value);
  }

  function handleColChecked(action) {
    const ckSlug = permissionChecked.value.filter((val) => String(val).endsWith(`.${action}`));
    if (ckSlug.length > 0)
      permissionChecked.value = [...permissionChecked.value.filter((val) => !ckSlug.includes(val))];
    else
      permissionChecked.value = [
        ...permissionChecked.value,
        ...permissionOptions.value
          .filter(({ label: val }) => String(val).endsWith(`.${action}`))
          .map(({ label }) => label),
      ];
  }
</script>

<style lang="less" scoped>
  .content-item {
    cursor: pointer;
  }

  .content-item:hover {
    background-color: rgb(134 195 245);
  }
</style>
