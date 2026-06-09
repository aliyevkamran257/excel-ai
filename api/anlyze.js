export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Sən Excel xətalarını tapan bir köməkçisən. 
Aşağıdakı Excel məlumatlarını analiz et və Azərbaycan dilində cavab ver.

Tapşırıq:
1. Boş xanaları tap və hansı sütunda olduğunu göstər
2. Yanlış formatları tap (məsələn, rəqəm yerinə mətn)
3. Dublikatları tap
4. Hər xəta üçün necə düzəldəcəyini izah et

Excel məlumatları:
${data}

Cavabını sadə və aydın dildə ver.`
          }
        ]
      })
    });

    const result = await response.json();
    const answer = result.content[0].text;

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({ error: 'Xəta baş verdi: ' + error.message });
  }
}
