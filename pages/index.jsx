// /pages/index.jsx
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";

const FEED_URL =
  process.env.NEXT_PUBLIC_FEED_URL ||
  "https://fetchrss.com/feed/aJ1o1ogE91UDaJ1o5k-SXnxS.rss";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0); // changes to force reload

  const apiUrl = useMemo(() => {
    const u = new URL("/api/feed", typeof window !== "undefined" ? window.location.origin : "http://localhost");
    u.searchParams.set("url", FEED_URL);
    u.searchParams.set("v", String(tick)); // cache-buster for our own fetch
    return u.toString();
  }, [tick]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(apiUrl, { cache: "no-store" });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Failed to load");
      setItems(j.items || []);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [apiUrl]);

  useEffect(() => {
    // auto-refresh every 5 minutes
    const id = setInterval(() => setTick((t) => t + 1), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Head>
        <title>DBTSS Live Feed</title>

        {/* Help Canva/Iframely recognize this as embeddable "player" */}
        <meta name="twitter:card" content="player" />
        <meta name="twitter:player" content="" />
        <meta name="twitter:player:width" content="500" />
        <meta name="twitter:player:height" content="900" />
        <meta property="og:type" content="video.other" />
        <meta property="og:video" content="" />
        <meta property="og:video:type" content="text/html" />
        <meta property="og:video:width" content="500" />
        <meta property="og:video:height" content="900" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          :root { --w: 560px; --gap: 16px; }
          html, body { margin:0; background:#f6f7fb; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
          .wrap { min-height: 100vh; display:grid; place-items:center; padding: 24px; }
          .card { width: min(100%, var(--w)); background:#fff; border-radius:16px; padding:20px; box-shadow:0 8px 30px rgba(0,0,0,.12); }
          h1 { margin: 0 0 8px 0; font-size: 18px; }
          .meta { color:#666; font-size: 12px; margin-bottom: 12px; }
          .grid { display: grid; grid-template-columns: 1fr; gap: var(--gap); }
          .item { border-radius: 12px; overflow: hidden; border: 1px solid #eee; background:#fff; }
          .thumb { width: 100%; display:block; aspect-ratio: 16/9; object-fit: cover; background:#ddd; }
          .body { padding: 12px 12px 14px; }
          .title { font-size: 14px; margin: 0 0 6px 0; color:#222; line-height: 1.25; }
          .btnrow { display:flex; gap:8px; justify-content: space-between; align-items:center; margin-bottom: 12px; }
          .btn { appearance:none; border-radius: 8px; border: 1px solid #d0d3d9; padding: 6px 10px; background:#fff; cursor:pointer; font-size: 13px; }
          .btn:disabled { opacity: .6; cursor: default; }
          .link { font-size: 12px; color:#0a66c2; text-decoration: none; }
        `}</style>
      </Head>

      <div className="wrap">
        <div className="card">
          <div className="btnrow">
            <h1>DBTSS Live Feed</h1>
            <div>
              <button className="btn" onClick={() => setTick((t) => t + 1)} disabled={loading}>
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>
          <div className="meta">
            Auto-updates every 5 minutes. Source: <code>FetchRSS</code>
          </div>
          {err && <div style={{color:"#b00020", marginBottom:12}}>Error: {err}</div>}
          {!err && loading && <div style={{margin:"12px 0"}}>Loading…</div>}

          <div className="grid">
            {items.map((it, i) => (
              <article className="item" key={i}>
                <img className="thumb" src={it.imageUrl} alt={it.title || "Post image"} loading="lazy" />
                <div className="body">
                  <div className="title">{it.title || "Untitled"}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:12, color:"#666"}}>
                      {it.date ? new Date(it.date).toLocaleDateString() : ""}
                    </div>
                    {it.link && (
                      <a className="link" href={it.link} target="_blank" rel="noopener noreferrer">
                        View on Facebook →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!loading && items.length === 0 && !err && (
            <div style={{marginTop:12, color:"#666"}}>No items with images yet.</div>
          )}
        </div>
      </div>
    </>
  );
}
