import dayjs, { Dayjs } from 'dayjs';
import { isEmpty } from '@/utils/is';
import { isProxy, toRaw } from 'vue';

interface ParseDatetimeRangeParams {
  dates?: [string | Dayjs, string | Dayjs];
  dateType: 'day' | 'week' | 'month';
}

const isEmptyFormValue = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'number') {
    return false; // fuk lodash, such a pain to use
  }

  return isEmpty(value);
};

export const formatDatetimeRange = ({
  dates,
  dateType,
}: ParseDatetimeRangeParams): [string, string] => {
  if (!dates) {
    const now = dayjs();
    return [now.startOf('day').format(), now.endOf('day').format()];
  }

  if (!Array.isArray(dates) || dates.length !== 2) {
    throw new Error('Invalid input: "dates" must be an array with exactly 2 elements.');
  }

  let [start, end] = dates;

  const parseDate = (date: string | Dayjs): Dayjs => {
    return typeof date === 'string' ? dayjs(date) : date;
  };

  start = parseDate(start);
  end = parseDate(end);

  if (!start.isValid() || !end.isValid()) {
    throw new Error('Invalid input: Both "start" and "end" must be valid dates.');
  }

  if (start.isAfter(end)) {
    throw new Error('"start" date cannot be after "end" date.');
  }

  switch (dateType) {
    case 'day':
      return [start.startOf('day').format(), end.endOf('day').format()];
    case 'week':
      return [start.startOf('week').format(), end.endOf('week').format()];
    case 'month':
      return [start.startOf('month').format(), end.endOf('month').format()];
    default:
      throw new Error(`Invalid "dateType": "${dateType}". Expected 'day', 'week', or 'month'.`);
  }
};

interface Data {
  [key: string]: any;

  dates?: [string | Dayjs, string | Dayjs];
}

export const cleanAndFormatData = (data: Data, filterType: 'day' | 'week' | 'month'): Data => {
  let cleanedData: Data = { ...data };

  Object.keys(cleanedData).forEach((key) => {
    if (isProxy(cleanedData[key])) {
      cleanedData[key] = toRaw(cleanedData[key]);
    }
  });

  Object.keys(cleanedData).forEach((key) => {
    if (isEmptyFormValue(cleanedData[key])) {
      delete cleanedData[key];
    }
  });

  if (cleanedData.dates) {
    const [start_time, end_time] = formatDatetimeRange({
      dates: cleanedData.dates,
      dateType: filterType,
    });
    cleanedData.start_time = start_time;
    cleanedData.end_time = end_time;
    delete cleanedData.dates;
  }

  return cleanedData;
};
