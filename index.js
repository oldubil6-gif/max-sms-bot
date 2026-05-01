import express from 'express';
import WebMaxClient from 'webmaxsocket';

const app = express();
app.use(express.json());

let client = null;

// 👇 ЗАМЕНИ НА СВОЙ НОМЕР MAX (с кодом страны, например +79001234567)
const YOUR_MAX_PHONE = '+79001234567';

async function initClient() {
  if (!client) {
    client = new WebMaxClient({ name: 'session1', deviceType: 'IOS' });
    await client.connect();
    await client.authorizeBySMS(YOUR_MAX_PHONE);
    console.log('✅ MAX клиент авторизован');
  }
  return client;
}

app.post('/send-sms', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: 'phone и code обязательны' });
  }
  
  try {
    const c = await initClient();
    await c.sendMessage({
      chat_id: phone,
      text: `Ваш код подтверждения MAX: ${code}`
    });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => {
  res.send('MAX SMS Bot работает');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
