export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Metodo non consentito');
  const { messaggio, contesto, apiKey } = req.body;

  try {
    const model = "gemini-3-pro-preview"; 
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `ISTRUZIONI: Sei un assistente editoriale. Scrivi un resoconto narrativo, lungo e dettagliato. Non usare elenchi. Non usare emoji. Usa solo H3 per i titoli. Analizza tutto ciò che trovi nel contesto, che siano notizie o email.\n\nCONTESTO:\n${contesto}\n\nRICHIESTA: ${messaggio}` }]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
      })
    });

    const data = await response.json();
    const rispostaText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ risposta: rispostaText });
  } catch (error) {
    res.status(500).json({ risposta: "Errore di connessione con Gemini 3 Pro." });
  }
}
