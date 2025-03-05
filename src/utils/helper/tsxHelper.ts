import { Slots } from 'vue';
import { isFunction } from '@/utils/is';
import { RenderOpts } from '@/components/Form';
import { NODATA } from '../render';

/**
 * @description:  Get slot to prevent empty error
 */
export function getSlot(slots: Slots, slot = 'default', data?: any, opts?: RenderOpts) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null;
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`);
    return null;
  }
  const slotFn = slots[slot];
  if (!slotFn) return null;
  const params = { ...data, ...opts };
  return slotFn(params);
}

/**
 * extends slots
 * @param slots
 * @param excludeKeys
 */
export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
  const slotKeys = Object.keys(slots);
  const ret: any = {};
  slotKeys.forEach((key) => {
    if (excludeKeys.includes(key)) {
      return null;
    }
    ret[key] = (data?: any) => getSlot(slots, key, data);
  });
  return ret;
}

/**
 * Format number
 * @param value
 * @param fixed
 * @return string
 */
export function formatNumber(value: number | string, fixed: number = 2): string {
  if (Number.isNaN(Number(value))) {
    return NODATA;
  }
  return Number(Number(value).toFixed(fixed)).toLocaleString('en-US');
}
