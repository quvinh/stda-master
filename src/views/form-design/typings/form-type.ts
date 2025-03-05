import { Ref } from 'vue';
import { IAnyObject } from './base-type';
import { IFormConfig, IVFormComponent } from './v-form-component';

export interface IToolbarMethods {
  showModal: (jsonData: IAnyObject) => void;
}

type ChangeTabKey = 1 | 2;
export interface IPropsPanel {
  changeTab: (key: ChangeTabKey) => void;
}
export interface IState {
  // Language
  locale: any;
  // Common components
  baseComponents: IVFormComponent[];
  // Custom components
  customComponents: IVFormComponent[];
  // Layout components
  layoutComponents: IVFormComponent[];
  // Property panel instance
  propsPanel: Ref<null | IPropsPanel>;
  // JSON modal instance
  jsonModal: Ref<null | IToolbarMethods>;
  // Import JSON data modal
  importJsonModal: Ref<null | IToolbarMethods>;
  // Code preview modal
  codeModal: Ref<null | IToolbarMethods>;
  // Preview modal
  eFormPreview: Ref<null | IToolbarMethods>;

  eFormPreview2: Ref<null | IToolbarMethods>;
}

export interface IFormDesignMethods {
  // 设置当前选中的控件
  handleSetSelectItem(item: IVFormComponent): void;
  // 添加控件到formConfig.formItems中
  handleListPush(item: IVFormComponent): void;
  // 复制控件
  handleCopy(item?: IVFormComponent, isCopy?: boolean): void;
  // 添加控件属性
  handleAddAttrs(schemas: IVFormComponent[], index: number): void;
  setFormConfig(config: IFormConfig): void;
  // 添加到表单中之前触发
  handleBeforeColAdd(
    event: { newIndex: string },
    schemas: IVFormComponent[],
    isCopy?: boolean,
  ): void;
}
