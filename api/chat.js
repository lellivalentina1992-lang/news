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
          parts: [{ text: `Sei un cronista meticoloso che scrive per una ricercatrice. 
          IL TUO COMPITO: Scrivere un TG scritto lunghissimo e narrativo che includa TUTTE le notizie presenti nel contesto.

          REGOLE TASSATIVE:
          1. NON ESCLUDERE NULLA: Ogni notizia, anche se ha una sola fonte o sembra minore, deve essere riportata.
          2. NARRATIVA INTEGRATA: Se più fonti parlano dello stesso fatto, unisci i dettagli. Se una notizia è isolata, presentala come un aggiornamento specifico.
          3. STRUTTURA: Usa intestazioni H3 per separare i grandi temi, ma all'interno dei capitoli scrivi paragrafi lunghi e discorsivi.
          4. ACCESSIBILITÀ: Niente elenchi, niente emoji. Usa un linguaggio chiaro e scorrevole per la sintesi vocale.
          5. PRIORITÀ: Inizia con le news più recenti, ma assicurati di arrivare fino all'ultima della lista.

          CONTESTO NOTIZIE:\n${contesto}\n\nRICHIESTA: ${messaggio}` }]
        }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 4000 }
      })
    });

    const data = await response.json();
    const rispostaText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ risposta: rispostaText });
  } catch (error) {
    res.status(500).json({ risposta: "Errore tecnico con Gemini 3 Pro." });
  }
}
