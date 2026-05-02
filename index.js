import express from 'express';
import WebMaxClient from 'webmaxsocket';

const app = express();
app.use(express.json());

let client = null;

// 👇 СЮДА ВСТАВЬ СВОЙ ТОКЕН (целиком, в кавычках)
const MAX_TOKEN = "An_Sx6HQ9HDirXO3iXXYLbVu2wNvi9im1hGqmVpNp_REeHl3LmO0DroEO4lkBhGsl8D4KtxVaouaspCzBk-BK5c38TH_FmU96t3cmCK-hd69oIKhkQg8c9LlHKt7O8CZBBGeq06n4PrLRSkoITWWMSiwsHxZYjEDZPcmt04v3R7FgFMkJ4Gr2l2QG3efZrTDVHCftLoe2tbuiVtKWlVDaQ9XYerwUvB0niQShnm_1k82eKtiUjjCpeogQEwb43ZTrFLolYBA33Qo4_jg_Z0RcVakU2dtVJdS6b8lfraVKvtGJoS7UlqjmUh6BCse6-MHblKHm9k8G8VNyp1OZPfHgH1Q4x0YMZAfiRU5lB62ABhyiO3VcMyr6G9X_a-e8wlMjOroOdXExs_kmpJx0uqT8wlpxdBkSt7PsNSyr6Er8LRmZLXnlmix2VT5E__ZFOUYuAIOmh8TGvUF_QiF02joz_q0GxeSKja1PaZ05e-VpAxw7wo6IqRCLCnNKk48dEXI8U8M2W2ULlMuDpE1ql4XzioLRP_mjpFS1X4kE44OEI3MZGuJemGG_3YxC8FM9VC2GtnGINaExFrC8WO56b4aPO8QxZFLC-yEInAfFRyAeBmEidQXPXCNp3g_WF8mtyCcLdQ9WwvZGV9MYlD_F5ZDZxTUz310qTEHEcHR8vSEROe69DzTD_DpfCFn1A8qlw9RSHhbc4E";

async function initClient() {
  client = new WebMaxClient({
    name: 'max_bot_session',
    deviceType: 'IOS',
    token: MAX_TOKEN,           // 👈 Токен вставлен сюда
    saveTwofaPassword: true
  });
  
  await client.start();
  console.log('✅ MAX клиент авторизован');
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
  initClient();  // 👈 ТЕПЕРЬ РАСКОММЕНТИРОВАНО
});
