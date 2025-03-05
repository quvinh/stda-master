export enum PermissionEnum {
  // BOM
  BOM_SEARCH = 'bom.search',
  BOM_CREATE = 'bom.create',
  BOM_UPDATE = 'bom.update',
  BOM_DELETE = 'bom.delete',

  // Customer
  CUSTOMER_SEARCH = 'customer.search',
  CUSTOMER_CREATE = 'customer.create',
  CUSTOMER_UPDATE = 'customer.update',
  CUSTOMER_DELETE = 'customer.delete',

  // Department
  DEPARTMENT_SEARCH = 'department.search',
  DEPARTMENT_CREATE = 'department.create',
  DEPARTMENT_UPDATE = 'department.update',
  DEPARTMENT_DELETE = 'department.delete',

  // Equipment
  EQUIPMENT_SEARCH = 'equipment.search',
  EQUIPMENT_CREATE = 'equipment.create',
  EQUIPMENT_UPDATE = 'equipment.update',
  EQUIPMENT_DELETE = 'equipment.delete',

  // Equipment Parameter
  EQUIPMENT_PARAMETER_SEARCH = 'equipment_parameter.search',
  EQUIPMENT_PARAMETER_CREATE = 'equipment_parameter.create',
  EQUIPMENT_PARAMETER_UPDATE = 'equipment_parameter.update',
  EQUIPMENT_PARAMETER_DELETE = 'equipment_parameter.delete',

  // Error Equipment
  ERROR_EQUIPMENT_SEARCH = 'error_equipment.search',
  ERROR_EQUIPMENT_CREATE = 'error_equipment.create',
  ERROR_EQUIPMENT_UPDATE = 'error_equipment.update',
  ERROR_EQUIPMENT_DELETE = 'error_equipment.delete',

  // Finished Product Export
  FINISHED_PRODUCT_EXPORT_SEARCH = 'finished_product_export.search',
  FINISHED_PRODUCT_EXPORT_CREATE = 'finished_product_export.create',
  FINISHED_PRODUCT_EXPORT_UPDATE = 'finished_product_export.update',
  FINISHED_PRODUCT_EXPORT_DELETE = 'finished_product_export.delete',

  // Finished Product Import
  FINISHED_PRODUCT_IMPORT_SEARCH = 'finished_product_import.search',
  FINISHED_PRODUCT_IMPORT_CREATE = 'finished_product_import.create',
  FINISHED_PRODUCT_IMPORT_UPDATE = 'finished_product_import.update',
  FINISHED_PRODUCT_IMPORT_DELETE = 'finished_product_import.delete',

  // Material Export
  MATERIAL_EXPORT_SEARCH = 'material_export.search',
  MATERIAL_EXPORT_CREATE = 'material_export.create',
  MATERIAL_EXPORT_UPDATE = 'material_export.update',
  MATERIAL_EXPORT_DELETE = 'material_export.delete',

  // Material Receipt
  MATERIAL_RECEIPT_SEARCH = 'material_receipt.search',
  MATERIAL_RECEIPT_CREATE = 'material_receipt.create',
  MATERIAL_RECEIPT_UPDATE = 'material_receipt.update',
  MATERIAL_RECEIPT_DELETE = 'material_receipt.delete',

  // Material
  MATERIAL_SEARCH = 'material.search',
  MATERIAL_CREATE = 'material.create',
  MATERIAL_UPDATE = 'material.update',
  MATERIAL_DELETE = 'material.delete',

  // Process
  PROCESS_SEARCH = 'process.search',
  PROCESS_CREATE = 'process.create',
  PROCESS_UPDATE = 'process.update',
  PROCESS_DELETE = 'process.delete',

  // Production Plan
  PRODUCTION_PLAN_SEARCH = 'production_plan.search',
  PRODUCTION_PLAN_CREATE = 'production_plan.create',
  PRODUCTION_PLAN_UPDATE = 'production_plan.update',
  PRODUCTION_PLAN_DELETE = 'production_plan.delete',

  // Product
  PRODUCT_SEARCH = 'product.search',
  PRODUCT_CREATE = 'product.create',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_DELETE = 'product.delete',

  // Standard Parameter
  STANDARD_PARAMETER_SEARCH = 'standard_parameter.search',
  STANDARD_PARAMETER_CREATE = 'standard_parameter.create',
  STANDARD_PARAMETER_UPDATE = 'standard_parameter.update',
  STANDARD_PARAMETER_DELETE = 'standard_parameter.delete',

  // Supplier
  SUPPLIER_SEARCH = 'supplier.search',
  SUPPLIER_CREATE = 'supplier.create',
  SUPPLIER_UPDATE = 'supplier.update',
  SUPPLIER_DELETE = 'supplier.delete',

  // Warehouse
  WAREHOUSE_SEARCH = 'warehouse.search',
  WAREHOUSE_CREATE = 'warehouse.create',
  WAREHOUSE_UPDATE = 'warehouse.update',
  WAREHOUSE_DELETE = 'warehouse.delete',

  // Warehouse Location
  WAREHOUSE_LOCATION_SEARCH = 'warehouse_location.search',
  WAREHOUSE_LOCATION_CREATE = 'warehouse_location.create',
  WAREHOUSE_LOCATION_UPDATE = 'warehouse_location.update',
  WAREHOUSE_LOCATION_DELETE = 'warehouse_location.delete',

  // Role
  ROLE_SEARCH = 'role.search',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',

  // Permission
  PERMISSION_SEARCH = 'permission.search',
  PERMISSION_CREATE = 'permission.create',
  PERMISSION_UPDATE = 'permission.update',
  PERMISSION_DELETE = 'permission.delete',

  // User
  USER_SEARCH = 'user.search',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',

  // Template
  TEMPLATE_SEARCH = 'template.search',
  TEMPLATE_CREATE = 'template.create',
  TEMPLATE_UPDATE = 'template.update',
  TEMPLATE_DELETE = 'template.delete',

  // Engine Power
  ENGINE_POWER_SEARCH = 'engine_power.search',
  ENGINE_POWER_CREATE = 'engine_power.create',
  ENGINE_POWER_UPDATE = 'engine_power.update',
  ENGINE_POWER_DELETE = 'engine_power.delete',

  // Unit
  UNIT_SEARCH = 'unit.search',
  UNIT_CREATE = 'unit.create',
  UNIT_UPDATE = 'unit.update',
  UNIT_DELETE = 'unit.delete',

  // Evaluation Criteria
  EVALUATION_CRITERIA_SEARCH = 'evaluation_criteria.search',
  EVALUATION_CRITERIA_CREATE = 'evaluation_criteria.create',
  EVALUATION_CRITERIA_UPDATE = 'evaluation_criteria.update',
  EVALUATION_CRITERIA_DELETE = 'evaluation_criteria.delete',

  // Mold
  MOLD_SEARCH = 'mold.search',
  MOLD_CREATE = 'mold.create',
  MOLD_UPDATE = 'mold.update',
  MOLD_DELETE = 'mold.delete',

  // Jig
  JIG_SEARCH = 'jig.search',
  JIG_CREATE = 'jig.create',
  JIG_UPDATE = 'jig.update',
  JIG_DELETE = 'jig.delete',

  // Acceptance Quality Limit
  ACCEPTANCE_QUALITY_LIMIT_SEARCH = 'acceptance_quality_limit.search',
  ACCEPTANCE_QUALITY_LIMIT_CREATE = 'acceptance_quality_limit.create',
  ACCEPTANCE_QUALITY_LIMIT_UPDATE = 'acceptance_quality_limit.update',
  ACCEPTANCE_QUALITY_LIMIT_DELETE = 'acceptance_quality_limit.delete',

  // Change Overtime
  CHANGE_OVERTIME_SEARCH = 'change_overtime.search',
  CHANGE_OVERTIME_CREATE = 'change_overtime.create',
  CHANGE_OVERTIME_UPDATE = 'change_overtime.update',
  CHANGE_OVERTIME_DELETE = 'change_overtime.delete',

  // CNC Tool Holder
  CNC_TOOL_HOLDER_SEARCH = 'cnc_tool_holder.search',
  CNC_TOOL_HOLDER_CREATE = 'cnc_tool_holder.create',
  CNC_TOOL_HOLDER_UPDATE = 'cnc_tool_holder.update',
  CNC_TOOL_HOLDER_DELETE = 'cnc_tool_holder.delete',

  // CNC Lathe Tool
  CNC_LATHE_TOOL_SEARCH = 'cnc_lathe_tool.search',
  CNC_LATHE_TOOL_CREATE = 'cnc_lathe_tool.create',
  CNC_LATHE_TOOL_UPDATE = 'cnc_lathe_tool.update',
  CNC_LATHE_TOOL_DELETE = 'cnc_lathe_tool.delete',

  // CNC Lathe Tool Type
  CNC_LATHE_TOOL_TYPE_SEARCH = 'cnc_lathe_tool_type.search',
  CNC_LATHE_TOOL_TYPE_CREATE = 'cnc_lathe_tool_type.create',
  CNC_LATHE_TOOL_TYPE_UPDATE = 'cnc_lathe_tool_type.update',
  CNC_LATHE_TOOL_TYPE_DELETE = 'cnc_lathe_tool_type.delete',

  // Specification
  SPEC_SEARCH = 'spec.search',
  SPEC_CREATE = 'spec.create',
  SPEC_UPDATE = 'spec.update',
  SPEC_DELETE = 'spec.delete',

  // UI
  UI_HOME = 'ui.home',
  UI_MANUFACTURING_HISTORY = 'ui.manufacturing_history',
  UI_POWER_CONSUMPTION = 'ui.power_consumption',
  UI_IQC_QUALITY = 'ui.iqc_quality',
  UI_PQC_QUALITY = 'ui.pqc_quality',
  UI_OQC_QUALITY = 'ui.oqc_quality',
  UI_FQC_QUALITY = 'ui.fqc_quality',
  UI_EQUIPMENT_PARAMETERS = 'ui.equipment_parameters',
  UI_EQUIPMENT_PERFORMANCE = 'ui.equipment_performance',
  UI_EQUIPMENT_TOOL = 'ui.equipment_tool',
  UI_EQUIPMENT_MOLD = 'ui.equipment_mold',
  UI_CT_PLAN = 'ui.ct_plan',
  UI_PO_PLAN = 'ui.po_plan',
  UI_PRODUCTION_PLAN = 'ui.production_plan',
  UI_LOAD_FACTOR = 'ui.load_factor',
  UI_KPI_DETAIL = 'ui.kpi_detail',
  UI_MATERIAL_RECEIPT_MANAGEMENT = 'ui.material_receipt_management',
  UI_MATERIAL_EXPORT_MANAGEMENT = 'ui.material_export_management',
  UI_INVENTORY_WAREHOUSE = 'ui.inventory_warehouse',

  // Operation Interface (OI)
  OI_PRODUCTION = 'oi.production',
  OI_QUALITY_IQC = 'oi.quality_iqc',
  OI_QUALITY_PQC = 'oi.quality_pqc',
  OI_QUALITY_OQC = 'oi.quality_oqc',
  OI_SELF_CHECKING_QUALITY = 'oi.self_checking_quality',
  OI_EQUIPMENT_EXTRUSION = 'oi.equipment_extrusion',
  OI_EQUIPMENT_NORMAL = 'oi.equipment_normal',
  OI_EQUIPMENT_CNC = 'oi.equipment_cnc',
  OI_MATERIAL_WAREHOUSE_IMPORT = 'oi.material_warehouse_import',
  OI_MATERIAL_WAREHOUSE_EXPORT = 'oi.material_warehouse_export',
  OI_SEMI_FINISHED_PRODUCT_WAREHOUSE = 'oi.semi_finished_product_warehouse',
  OI_SEMI_FINISHED_PRODUCT_WAREHOUSE_EXPORT = 'oi.semi_finished_product_warehouse_export',
  OI_FINISHED_PRODUCT_WAREHOUSE = 'oi.finished_product_warehouse',
  OI_FINISHED_PRODUCT_WAREHOUSE_EXPORT = 'oi.finished_product_warehouse_export',
}
