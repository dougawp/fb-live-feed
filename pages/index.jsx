import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>DBTSS Live Feed</title>
        {/* Help Canva/Iframely recognize this as embeddable */}
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
          html, body { margin:0; background:#f6f7fb; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
          .wrap { min-height: 100vh; display:grid; place-items:center; }
          .card { width: min(100%, 560px); background:#fff; border-radius:16px; padding:24px; box-shadow:0 8px 30px rgba(0,0,0,.12); }
        `}</style>
      </Head>
      <div className="wrap">
        <div className="card">
          <h1 style={{margin:0}}>DBTSS Live Feed (setup)</h1>
          <p style={{color:"#555"}}>Deployment successful. Next we’ll connect the RSS and auto-refresh.</p>
        </div>
      </div>
    </>
  );
}
