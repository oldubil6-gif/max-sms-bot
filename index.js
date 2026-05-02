import express from 'express';

const app = express();
app.use(express.json());

const MAX_TOKEN = "An_Sx6HQ9HDirXO3iXXYLbVu2wNvi9im1hGqmVpNp_REeHl3LmO0DroEO4lkBhGsl8D4KtxVaouaspCzBk-BK5c38TH_FmU96t3cmCK-hd69oIKhkQg8c9LlHKt7O8CZBBGeq06n4PrLRSkoITWWMSiwsHxZYjEDZPcmt04v3R7FgFMkJ4Gr2l2QG3efZrTDVHCftLoe2tbuiVtKWlVDaQ9XYerwUvB0niQShnm_1k82eKtiUjjCpeogQEwb43ZTrFLolYBA33Qo4_jg_Z0RcVakU2dtVJdS6b8lfraVKvtGJoS7UlqjmUh6BCse6-MHblKHm9k8G8VNyp1OZPfHgH1Q4x0YMZAfiRU5lB62ABhyiO3VcMyr6G9X_a-e8wlMjOroOdXExs_kmpJx0uqT8wlpxdBkSt7PsNSyr6Er8LRmZLXnlmix2VT5E__ZFOUYuAIOmh8TGvUF_QiF02joz_q0GxeSKja1PaZ05e-VpAxw7wo6IqRCLCnNKk48dEXI8U8M2W2ULlMuDpE1ql4XzioLRP_mjpFS1X4kE44OEI3MZGuJemGG_3YxC8FM9VC2GtnGINaExFrC8WO56b4aPO8QxZFLC-yEInAfFRyAeBmEidQXPXCNp3g_WF8mtyCcLdQ9WwvZGV9MYlD_F5ZDZxTUz310qTEHEcHR8vSEROe69DzTD_DpfCFn1A8qlw9RSHhbc4E";

// Эндпоинт для отправки SMS (через прямое API MAX)
app.post('/send-sms', async (req, res) => {
  const { phone, code } = req.body;
  console.log(`📨 Запрос на отправку: ${phone} -> ${code}`);

  if (!phone || !code) {
    return res.status(400).json({ error: 'phone и code обязательны' });
  }

  try {
    // Прямой вызов API MAX (если известен эндпоинт отправки сообщения)
    const response = await fetch('https://max.ru/api/v1/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAX_TOKEN}`
      },
      body: JSON.stringify({
        recipient: phone,
        text: `Ваш код подтверждения: ${code}`
      })
    });

    if (!response.ok) {
      throw new Error(`API MAX ответил с ошибкой: ${response.status}`);
    }

    console.log('✅ SMS отправлена через API MAX');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Ошибка при отправке:', error.message);
    res.status(500).json({ error: 'Ошибка отправки SMS' });
  }
});

app.get('/', (req, res) => {
  res.send('MAX SMS Bot работает');
});

setInterval(() => {
  console.log('🟢 Keep-alive ping');
}, 20000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log('🏁 Бот готов, токен установлен');
});
