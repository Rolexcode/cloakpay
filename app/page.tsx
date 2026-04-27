"use client";

import { useState } from "react";
import { createPaymentLink } from "@/lib/links";

// SVG icon components — no emojis anywhere
function LockIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeOffIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ZapIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function KeyIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function CopyIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Home() {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!label || !amount || !walletAddress) return;
    setLoading(true);
    try {
      const link = await createPaymentLink({
        label,
        amount: parseFloat(amount),
        token: "USDC",
        recipientAddress: walletAddress,
      });
      setGeneratedLink(`${window.location.origin}/pay/${link.slug}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check your .env.local values.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080810;
          color: #f0eeff;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .grid-bg {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(108, 71, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 71, 255, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .orb {
          position: fixed; border-radius: 50%;
          filter: blur(120px); pointer-events: none; z-index: 0;
        }
        .orb-1 { width: 500px; height: 500px; background: rgba(108, 71, 255, 0.12); top: -100px; right: -100px; }
        .orb-2 { width: 400px; height: 400px; background: rgba(0, 210, 190, 0.07); bottom: -50px; left: -100px; }

        nav {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 20px; letter-spacing: -0.5px;
          display: flex; align-items: center; gap: 8px;
        }

        .logo-dot {
          width: 8px; height: 8px;
          background: #6c47ff; border-radius: 50%;
          box-shadow: 0 0 12px #6c47ff;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }

        .nav-badge {
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.4); letter-spacing: 0.5px;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 4px 10px; border-radius: 20px;
        }

        main {
          position: relative; z-index: 10; flex: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          max-width: 1100px; margin: 0 auto;
          width: 100%; padding: 60px 40px; align-items: center;
        }

        @media (max-width: 768px) {
          main { grid-template-columns: 1fr; padding: 40px 20px; }
          nav { padding: 16px 20px; }
          .hero { padding-right: 0; margin-bottom: 40px; }
        }

        .hero { padding-right: 60px; }

        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 1.5px;
          text-transform: uppercase; color: #6c47ff;
          border: 1px solid rgba(108, 71, 255, 0.3);
          background: rgba(108, 71, 255, 0.08);
          padding: 5px 12px; border-radius: 20px; margin-bottom: 24px;
        }

        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -2px; margin-bottom: 20px;
        }

        .hero h1 span {
          background: linear-gradient(135deg, #6c47ff, #00d2be);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero p {
          font-size: 16px; line-height: 1.7;
          color: rgba(240, 238, 255, 0.55);
          margin-bottom: 36px; max-width: 380px;
        }

        .stats { display: flex; gap: 32px; }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
        .stat-label { font-size: 11px; color: rgba(240, 238, 255, 0.35); letter-spacing: 0.5px; }
        .stat-divider { width: 1px; background: rgba(255,255,255,0.08); align-self: stretch; }

        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 36px;
          backdrop-filter: blur(20px);
        }

        .form-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.3px; }
        .form-subtitle { font-size: 13px; color: rgba(240, 238, 255, 0.4); margin-bottom: 28px; }

        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }

        .field label {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: rgba(240, 238, 255, 0.4);
        }

        .field input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 12px 14px;
          color: #f0eeff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none;
          transition: border-color 0.2s, background 0.2s; width: 100%;
        }

        .field input::placeholder { color: rgba(240, 238, 255, 0.2); }
        .field input:focus { border-color: rgba(108, 71, 255, 0.5); background: rgba(108, 71, 255, 0.06); }

        .token-badge {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          font-size: 11px; font-weight: 600; color: #00d2be; letter-spacing: 0.5px;
          background: rgba(0, 210, 190, 0.1); border: 1px solid rgba(0, 210, 190, 0.2);
          padding: 2px 8px; border-radius: 6px;
        }

        .input-wrap { position: relative; }

        .btn-create {
          width: 100%; margin-top: 8px; padding: 14px;
          background: #6c47ff; border: none; border-radius: 10px;
          color: #fff; font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: -0.2px;
          cursor: pointer; transition: all 0.2s;
        }

        .btn-create:hover:not(:disabled) {
          background: #7c5aff; transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(108, 71, 255, 0.4);
        }

        .btn-create:disabled { opacity: 0.5; cursor: not-allowed; }

        .link-result {
          margin-top: 20px;
          background: rgba(0, 210, 190, 0.05);
          border: 1px solid rgba(0, 210, 190, 0.2);
          border-radius: 12px; padding: 16px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .link-result-label {
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: #00d2be;
          margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
        }

        .link-result-label::before {
          content: ''; width: 6px; height: 6px;
          background: #00d2be; border-radius: 50%;
          box-shadow: 0 0 8px #00d2be;
        }

        .link-url {
          font-size: 12px; font-family: monospace;
          color: rgba(240, 238, 255, 0.7);
          word-break: break-all; line-height: 1.5; margin-bottom: 12px;
        }

        .btn-copy {
          display: flex; align-items: center; gap: 6px;
          background: rgba(0, 210, 190, 0.1);
          border: 1px solid rgba(0, 210, 190, 0.25);
          border-radius: 7px; padding: 7px 14px;
          color: #00d2be; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-copy:hover { background: rgba(0, 210, 190, 0.15); }

        .features { display: flex; gap: 8px; margin-top: 20px; flex-wrap: wrap; }

        .feature-pill {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: rgba(240, 238, 255, 0.4);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 5px 10px; border-radius: 20px;
        }
      `}</style>

      <div className="page">
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <nav>
          <div className="logo">
            <div className="logo-dot" />
            CloakPay
          </div>
          <div className="nav-badge">Powered by Umbra · Solana</div>
        </nav>

        <main>
          {/* Hero */}
          <div className="hero">
            <div className="hero-tag">
              <LockIcon size={11} color="#6c47ff" />
              Financial Privacy Layer
            </div>
            <h1>
              Get paid.<br />
              Stay <span>invisible.</span>
            </h1>
            <p>
              Create a shareable payment link in seconds.
              Your wallet address, balance, and transaction history stay completely private —
              powered by Umbra's confidential transfer protocol on Solana.
            </p>
            <div className="stats">
              <div className="stat">
                <div className="stat-value">0</div>
                <div className="stat-label">Data Exposed</div>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <div className="stat-value">100%</div>
                <div className="stat-label">On-chain Private</div>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <div className="stat-value">&lt;3s</div>
                <div className="stat-label">To Create Link</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="form-card">
            <div className="form-title">Create payment link</div>
            <div className="form-subtitle">Share it. Get paid. No wallet exposed.</div>

            <div className="field">
              <label>Your name or label</label>
              <input
                placeholder="e.g. Alex, Design Work, Invoice #42"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Amount</label>
              <div className="input-wrap">
                <input
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ paddingRight: '60px' }}
                />
                <div className="token-badge">USDC</div>
              </div>
            </div>

            <div className="field">
              <label>Your Solana wallet address</label>
              <input
                placeholder="Enter your wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>

            <button
              className="btn-create"
              onClick={handleCreate}
              disabled={loading || !label || !amount || !walletAddress}
            >
              {loading ? "Generating..." : "Generate Private Link →"}
            </button>

            {generatedLink && (
              <div className="link-result">
                <div className="link-result-label">Link ready</div>
                <div className="link-url">{generatedLink}</div>
                <button className="btn-copy" onClick={handleCopy}>
                  {copied
                    ? <><CheckIcon color="#00d2be" /> Copied</>
                    : <><CopyIcon color="#00d2be" /> Copy link</>
                  }
                </button>
              </div>
            )}

            <div className="features">
              <div className="feature-pill">
                <LockIcon size={11} color="rgba(240,238,255,0.4)" />
                Hidden sender
              </div>
              <div className="feature-pill">
                <EyeOffIcon size={11} color="rgba(240,238,255,0.4)" />
                Hidden amount
              </div>
              <div className="feature-pill">
                <ZapIcon size={11} color="rgba(240,238,255,0.4)" />
                Instant settlement
              </div>
              <div className="feature-pill">
                <KeyIcon size={11} color="rgba(240,238,255,0.4)" />
                Viewing keys
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}