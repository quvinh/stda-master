import { message } from 'ant-design-vue';

// `navigator.clipboard` might cause compatibility issues due to browser settings or browser compatibility
export function copyText(
  text: string,
  prompt: string | null = 'Copied to clipboard successfully!',
) {
  if (navigator.clipboard) {
    return navigator.clipboard
      .writeText(text)
      .then(() => {
        prompt && message.success(prompt);
      })
      .catch((error) => {
        message.error('Copy failed! ' + error.message);
        return error;
      });
  }
  if (Reflect.has(document, 'execCommand')) {
    return new Promise<void>((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        // In mobile Safari, clicking the copy button causes the entire page to jump a little
        textArea.style.width = '0';
        textArea.style.position = 'fixed';
        textArea.style.left = '-999px';
        textArea.style.top = '10px';
        textArea.setAttribute('readonly', 'readonly');
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        prompt && message.success(prompt);
        resolve();
      } catch (error) {
        message.error('Copy failed! ' + error.message);
        reject(error);
      }
    });
  }
  return Promise.reject(
    `API error in either "navigator.clipboard" or "document.execCommand", copy failed!`,
  );
}
