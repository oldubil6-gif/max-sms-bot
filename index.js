import express from 'express';
import WebMaxClient from 'webmaxsocket';

const app = express();
app.use(express.json());

let client = null;

// Функция инициализации с твоими реальными данными
async function initClient() {
  client = new WebMaxClient({
    name: 'max_bot_session',
    deviceType: 'IOS',
    saveTwofaPassword: true,
    // ВАЖНО: сюда вставь свой номер и токен вручную (получишь 1 раз)
  });
  
  // Пытаемся восстановить сессию (если есть сохранённый токен)
  await client.start();
  console.log('✅ MAX клиент готов');
  return client;
}

app.post('/send-sms', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: 'phone и code обязательны' });
  }
  
  try {
    if (!client) await initClient();
    await client.sendMessage({
      chat_id: phone,
      text: `Ваш код подтверждения: ${code}`
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка отправки' });
  }
});

app.get('/', (req, res) => {
  res.send('MAX SMS Bot работает');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  // initClient() раскомментируй, когда будет токен
});
