import { BasicColumn, FormProps } from '@/components/Table';
import inspectionCriterionEvaluationMethod from '@/enums/inspectionCriterionEvaluationMethod';
import InspectionCriterionInputType from '@/enums/inspectionCriterionInputType';
import { NODATA } from '@/utils/render';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Danh mục',
      dataIndex: 'category',
      align: 'center',
      fixed: 'left',
      width: 100,
      customRender: ({ record }) => {
        return record?.inspection_criterion_category?.name;
      },
    },
    {
      title: 'Tên chỉ tiêu',
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Kiểu nhập',
      dataIndex: 'input_type',
      align: 'center',
      fixed: 'left',
      width: 100,
      customRender: ({ record }) => {
        switch (record?.input_type) {
          case InspectionCriterionInputType.TEXT:
            return 'Văn bản';
          case InspectionCriterionInputType.NUMBER:
            return 'Số';
          case InspectionCriterionInputType.PASS_FAIL:
            return 'Đạt/Không đạt';
          default:
            return 'Không xác định';
        }
      },
    },
    {
      title: 'PP đánh giá',
      dataIndex: 'evaluation_method',
      align: 'center',
      fixed: 'left',
      width: 100,
      customRender: ({ record }) => {
        switch (record?.evaluation_method) {
          case inspectionCriterionEvaluationMethod.NONE:
            return 'Không';
          case inspectionCriterionEvaluationMethod.COMPARE_WITH_RANGE:
            return 'So sánh khoảng';
          case inspectionCriterionEvaluationMethod.PASS_FAIL:
            return 'Đạt/Không đạt';
          default:
            return 'Không xác định';
        }
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      fixed: 'left',
      width: 150,
    },
    {
      title: 'Khoảng giá trị',
      align: 'center',
      fixed: 'left',
      width: 100,
      customRender: ({ record }) => {
        const left = record?.lower_limit ?? 'Min';
        const right = record?.upper_limit ?? 'MAX';
        if (left == 'Min' && right == 'MAX') {
          return NODATA;
        }
        return `${left} - ${right}`;
      },
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    layout: 'vertical',
    schemas: [
      {
        field: 'name',
        label: 'Tên chỉ tiêu',
        component: 'Input',
      },
      {
        field: 'type',
        label: 'Loại chỉ tiêu',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'Kích thước', value: 'Kích thước' },
            { label: 'Đặc định', value: 'Đặc định' },
            { label: 'Ngoại quan', value: 'Ngoại quan' },
          ],
        },
      },
      {
        field: 'process_id',
        label: 'Mã công đoạn',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'IQC', value: 'IQC' },
            { label: 'PQC', value: 'PQC' },
            { label: 'OQC', value: 'OQC' },
            { label: 'DD', value: 'DD' },
          ],
        },
      },
    ],
  };
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}
