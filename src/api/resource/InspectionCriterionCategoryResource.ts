import BaseResource from '@/api/resource/BaseResource';

export default class InspectionCriterionCategoryResource extends BaseResource {
  static override endpoint: string = '/v1/inspection-criterion-categories';

  static override labelKey: string = 'name';
}
