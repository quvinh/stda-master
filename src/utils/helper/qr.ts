import { message } from 'ant-design-vue';

export interface QrValue {
  value: string;
  type: string;
}

/**
 * @description Parse QRCode
 * @param data
 * @returns
 */
const parseQrCode = (data: unknown): QrValue | null => {
  if (typeof data !== 'string') {
    message.error('Invalid QR code, data is not a string');
    return null;
  }

  try {
    const parsedData = JSON.parse(data);

    if (typeof parsedData !== 'object' || parsedData === null) {
      message.error('Invalid QR code, parsed data is not an object');
      return null;
    }

    const { type, value } = parsedData as Record<string, unknown>;

    if (typeof type !== 'string' || typeof value !== 'string') {
      message.error('Invalid QR code, "type" or "value" is not a string');
      return null;
    }

    return { type, value };
  } catch (error) {
    console.error('Error parsing QR code data:', error);
    message.error('Invalid QR code, failed to parse data');
    return null;
  }
};

export { parseQrCode };
