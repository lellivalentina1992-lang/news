export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Metodo non consentito');
  const { messaggio, contesto, apiKey } = req.body;

  try {
    // MODELLO: Gemini 3 Pro (release Dicembre 2025)
    const model = "gemini-3-pro-latest"; 
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `ISTRUZIONI DI SISTEMA: Sei l'assistente di una ricercatrice. Scrivi un TG lungo, narrativo e discorsivo. Non usare elenchi puntati. Non usare mai emoji. Usa solo intestazioni H3 per dividere i capitoli. Quando trovi la stessa notizia su più fonti, confrontale e crea un unico paragrafo dettagliato.\n\nCONTESTO NOTIZIE CARICATE:\n${contesto}\n\nRICHIESTA UTENTE: ${messaggio}` }]
        }],
        generationConfig: { 
          temperature: 0.7,
          maxOutputTokens: 3500 
        }
      })
    });

    const data = await response.json();
    if (!data.candidates) throw new Error("Risposta API non valida");
    
    const rispostaText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ risposta: rispostaText });
  } catch (error) {
    res.status(500).json({ risposta: "Errore nel collegamento con Gemini 3 Pro." });
  }
}
