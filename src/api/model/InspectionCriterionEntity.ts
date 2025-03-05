import inspectionCriterionEvaluationMethod from '@/enums/inspectionCriterionEvaluationMethod';
import InspectionCriterionInputType from '@/enums/inspectionCriterionInputType';
import InspectionCriterionCategoryEntity from './InspectionCriterionCategoryEntity';
import InspectionCriterionTargetEntity from './InspectionCriterionTargetEntity';

export interface InspectionCriterionEntity {
  id: string;
  name: string;
  inspection_criterion_category_id: string;
  inspection_criterion_category?: InspectionCriterionCategoryEntity;
  inspection_criterion_targets: InspectionCriterionTargetEntity[];
  input_type: InspectionCriterionInputType;
  evaluation_method: inspectionCriterionEvaluationMethod;
  description?: string;
  lower_limit?: number;
  upper_limit?: number;
  created_at: Date;
  updated_at: Date;
}
