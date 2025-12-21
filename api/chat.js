export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Metodo non consentito');
  const { messaggio, contesto, apiKey, webAttiva } = req.body;

  try {
    const model = "gemini-3-pro-preview";
    
    // Istruzioni per l'IA: deve essere sintetica e precisa per NVDA
    let istruzioniIA = "Sei l'assistente di Valentina, una ricercatrice. Rispondi in modo discorsivo, senza emoji, senza elenchi puntati se non necessari. Usa solo H3 per i titoli.";
    
    if (webAttiva) {
      istruzioniIA += " Usa le tue capacità di ricerca online per fornire informazioni aggiornate oltre al contesto fornito.";
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${istruzioniIA}\n\nCONTESTO (Feed o Email):\n${contesto}\n\nDOMANDA: ${messaggio}` }]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2500 }
      })
    });

    const data = await response.json();
    const rispostaText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ risposta: rispostaText });
  } catch (error) {
    res.status(500).json({ risposta: "Errore di collegamento con Gemini 3 Pro." });
  }
}
