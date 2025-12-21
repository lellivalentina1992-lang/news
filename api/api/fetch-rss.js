export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL mancante" });

  try {
    const response = await fetch(url);
    const xml = await response.text();
    
    // Header necessari per l'accessibilità dei dati dal browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).json({ error: "Errore caricamento feed" });
  }
}
