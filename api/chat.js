export default async function handler(req, res) {
  const { messaggio, contesto, webAttiva, apiKey, searchId } = req.body;
  const oggi = new Date().toISOString().split('T')[0];

  let datiWeb = "";
  if (webAttiva) {
    let query = messaggio;
    if (messaggio.toLowerCase().includes("oggi")) query += ` after:${oggi}`;
    try {
      const sRes = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchId}&q=${encodeURIComponent(query)}`);
      const sData = await sRes.json();
      datiWeb = sData.items ? sData.items.map(i => `${i.title}: ${i.snippet}`).join("\n") : "Nessun risultato web.";
    } catch (e) { datiWeb = "Errore durante la ricerca web."; }
  }

  const prompt = `Sei un esperto news. Oggi è il 21 dicembre 2025. Analizza i feed: ${contesto}. Analizza il web: ${datiWeb}. Rispondi alla domanda: ${messaggio}. Usa intestazioni H3 e elenchi puntati.`;

  try {
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const aiData = await aiRes.json();
    res.status(200).json({ risposta: aiData.candidates[0].content.parts[0].text });
  } catch (e) { res.status(500).json({ risposta: "Errore dell'IA o Chiave API non valida." }); }
}
