import { b64toBlob } from './dataBlob';

export function downloadExcel(data, type, file) {
  const blob = b64toBlob(data, type);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = file;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
