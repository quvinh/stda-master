import { message } from 'ant-design-vue';

/**
 * @description Set style OI table height
 * @param name
 * @param windowHeight
 * @returns
 */
export function oiTableHeight(name: string, windowHeight: number = 0) {
  const oiHeader: any = document.querySelector('.oi-header');
  const oiContent: any = document.querySelector('.oi-content');
  const oiFooter: any = document.querySelector('.oi-footer');
  if (oiContent) {
    const sectionTop = oiContent?.querySelector('.section-top');
    const sectionMiddle = oiContent?.querySelector('.section-middle');
    const sectionButton = oiContent?.querySelector('.section-button');
    const table = oiContent?.querySelector(`.${name}`);
    if (table) {
      const header = table.querySelector('.ant-table-thead');
      const pagination = table.querySelector('.ant-table-pagination');
      const tableBody = table.querySelector('.ant-table-body');
      const antEmpty = table.querySelector('.ant-empty-normal');
      const antLocaleEmpty = table.querySelector('.ant-table-expanded-row-fixed');
      let windowH = windowHeight;
      if (windowH === 0) windowH = oiContent?.offsetHeight ?? 0;
      const result: number =
        windowH -
        (oiHeader?.offsetHeight ?? 0) -
        (oiFooter?.offsetHeight ?? 0) -
        (sectionTop?.offsetHeight ?? 0) -
        (sectionMiddle?.offsetHeight ?? 0) -
        (sectionButton?.offsetHeight ?? 0) -
        (header?.offsetHeight ?? 0) -
        (pagination?.offsetHeight ?? 0) -
        24 - // breadcrumb
        windowH * 0.04;

      if (Number(result) > 0) {
        if (tableBody) tableBody?.style.setProperty('height', `${result}px`, 'important');
        if (antEmpty) antEmpty?.style.setProperty('height', `${result - 10}px`);
        if (antLocaleEmpty) antLocaleEmpty?.style.setProperty('height', `${result - 10}px`);
        return result;
      }
    }
  }
  return undefined;
}

/**
 * @description Request camera permissions
 */
export async function requestCameraPermissions() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    console.log('Camera permission granted');
  } catch (error) {
    message.error('Quyền truy cập máy ảnh bị từ chối');
    console.error('Camera permission denied or failed', error);
  }
}
