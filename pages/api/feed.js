// /pages/api/feed.js
const FEED_URL =
  process.env.FEED_URL ||
  "https://fetchrss.com/feed/aJ1o1ogE91UDaJ1o5k-SXnxS.rss";

const firstImageFromHtml = (html = "") => {
  // extremely small HTML img extractor (no dependencies)
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
};

const decodeHtml = (str = "") =>
  str
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

export default async function handler(req, res) {
  try {
    const url = (req.query.url || FEED_URL).toString();
    const r = await fetch(url, {
      headers: {
        "User-Agent": "DBTSS-CanvaFeed/1.0 (+https://vercel.app)"
      }
    });
    if (!r.ok) {
      return res.status(502).json({ error: "RSS fetch failed", status: r.status });
    }
    const xml = await r.text();

    // very small XML-to-JSON parse without a library:
    // pull out <item> blocks and then read child tags with regex.
    // (Good enough because FetchRSS is well-formed.)
    const items = [];
    const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    for (const block of itemBlocks) {
      const grab = (tag) => {
        const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
        return m ? decodeHtml(m[1].trim()) : ""
