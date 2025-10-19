import axios from 'axios';

interface SendWhatsAppParams {
  toPhoneNumber: string; // E.164 formatted phone number
  message: string;
}

const GRAPH_BASE = 'https://graph.facebook.com/v19.0';

export async function sendWhatsAppMessage({ toPhoneNumber, message }: SendWhatsAppParams) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    console.warn('WhatsApp env vars missing');
    return;
  }
  try {
    const url = `${GRAPH_BASE}/${phoneNumberId}/messages`;
    const body = {
      messaging_product: 'whatsapp',
      to: toPhoneNumber,
      type: 'text',
      text: { body: message }
    };
    const resp = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('WhatsApp message sent', resp.data);
  } catch (e: any) {
    console.error('WhatsApp send error', e.response?.data || e.message);
    throw e;
  }
}
