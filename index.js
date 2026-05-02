import express from 'express';
import WebMaxClient from 'webmaxsocket';

const app = express();
app.use(express.json());

let client = null;

// 👇 ТВОЙ ТОКЕН (замени на актуальный, если истёк)
const MAX_TOKEN = "An_Sx6HQ9HDirXO3iXXYLbVu2wNvi9im1hGqmVpNp_REeHl3LmO0DroEO4lkBhGsl8D4KtxVaouaspCzBk-BK5c38TH_FmU96t3cmCK-hd69oIKhkQg8c9LlHKt7O8CZBBGeq06n4PrLRSkoITWWMSiwsHxZYjEDZPcmt04v3R7FgFMkJ4Gr2l2QG3efZrTDVHCftLoe2tbuiVtKWlVDaQ9XYerwUvB0niQShnm_1k82eKtiUjjCpeogQEwb43ZTrFLolYBA33Qo4_jg_Z0RcVakU2dtVJdS6b8lfraVKvtGJoS7UlqjmUh6BCse6-MHblKHm9k8G8VNyp1OZPfHgH1Q4x0YMZAfiRU5lB62ABhyiO3VcMyr6G9X_a-e8wlMjOroOdXExs_kmpJx0uqT8wlpxdBkSt7PsNSyr6Er8LRmZLXnlmix2VT5E__ZFOUYuAIOmh8TGvUF_QiF02joz_q0GxeSKja1PaZ05e-VpAxw7wo6IqRCLCnNKk48dEXI8U8M2W2ULlMuDpE1ql4XzioLRP_mjpFS1X4kE44OEI3MZGuJemGG_3YxC8FM9VC2GtnGINaExFrC8WO56b4aPO8QxZFLC-yEInAfFRyAeBmEidQXPXCNp3g_WF8mtyCcLdQ9WwvZGV9MYlD_F5ZDZxTUz310qTEHEcHR8vSEROe69DzTD_DpfCFn1A8qlw9RSHhbc4E";

async function initClient() {
  console.log('🔧 Инициализация клиента MAX...');
  try {
    client = new WebMaxClient({
      name: 'max_bot_session',
      deviceType: 'IOS',
      token: MAX_TOKEN,
      saveTwofaPassword: true
    });
    
    console.log('🔧 Вызов client.start()...');
    await client.start();
    console.log('✅ MAX клиент успешно авторизован!');
    return client;
  } catch (error) {
    console.error('❌ Ошибка при инициализации MAX клиента:');
    console.error(error);
    // Не выходим из процесса, а просто логируем
    return null;
  }
}

app.post('/send-sms', async (req, res) => {
  console.log('📨 Получен запрос /send-sms', req.body);
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: 'phone и code обязательны' });
  }
  
  try {
    if (!client) {
      console.log('🔧 Клиент не инициализирован, инициализируем...');
      await initClient();
    }
    if (!client) {
      throw new Error('Не удалось инициализировать клиента');
    }
    console.log(`📤 Отправляем SMS на ${phone} с кодом ${code}`);
    await client.sendMessage({
      chat_id: phone,
      text: `Ваш код подтверждения: ${code}`
    });
    console.log('✅ SMS отправлена');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Ошибка при отправке SMS:');
    console.error(error);
    res.status(500).json({ error: 'Ошибка отправки' });
  }
});

app.get('/', (req, res) => {
  res.send('MAX SMS Bot работает');
});

// Keep-alive пинг каждые 20 секунд
setInterval(() => {
  console.log('🟢 Keep-alive ping');
}, 20000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log('🔧 Запускаем инициализацию клиента...');
  await initClient();
  console.log('🏁 Клиент инициализирован, сервер готов к приёму запросов');
});
