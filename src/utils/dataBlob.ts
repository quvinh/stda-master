export function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  // Remove Data URL prefixes if present
  const base64WithoutPrefix = b64Data.startsWith('data:') ? b64Data.split(',')[1] : b64Data;
  const byteCharacters = atob(base64WithoutPrefix);
  const byteArrays: Uint8Array[] = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}
