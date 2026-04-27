"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { getPaymentLink, PaymentLink } from "@/lib/links";

// Validate slug format before hitting Redis.
// Slugs are always 6 lowercase alphanumeric characters — anything else is rejected immediately.
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]{6}$/.test(slug);
}

export default function PayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const [txSig, setTxSig] = useState("");

  useEffect(() => {
    async function load() {
      // Reject malformed slugs without touching the database
      if (!isValidSlug(slug)) {
        setLoading(false);
        return;
      }
      const data = await getPaymentLink(slug);
      setLink(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  async function handlePay() {
    if (!link) return;
    setPaying(true);
    setError("");
    try {
      // Umbra SDK confidential transfer — wired on Day 3
      await new Promise((r) => setTimeout(r, 2500));
      setTxSig("5xGh...k9mZ");
      setPaid(true);
    } catch {
      setError("Transaction failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #080810; color: #f0eeff; font-family: 'DM Sans', sans-serif; min-height: 100vh; }

    .page {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 24px; position: relative; overflow: hidden;
    }

    .grid-bg {
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(108,71,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(108,71,255,0.04) 1px, transparent 1px);
      background-size: 48px 48px; pointer-events: none; z-index: 0;
    }

    .orb { position: fixed; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
    .orb-1 { width: 500px; height: 500px; background: rgba(108,71,255,0.1); top: -100px; right: -100px; }
    .orb-2 { width: 400px; height: 400px; background: rgba(0,210,190,0.06); bottom: -50px; left: -100px; }

    .card {
      position: relative; z-index: 10;
      width: 100%; max-width: 440px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 24px; padding: 36px;
      backdrop-filter: blur(20px);
      animation: fadeUp 0.4s ease;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .privacy-badge {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; font-weight: 500; letter-spacing: 0.8px;
      text-transform: uppercase; color: #6c47ff;
      background: rgba(108,71,255,0.08);
      border: 1px solid rgba(108,71,255,0.2);
      padding: 5px 12px; border-radius: 20px; margin-bottom: 24px;
    }

    .badge-dot {
      width: 6px; height: 6px; background: #6c47ff;
      border-radius: 50%; box-shadow: 0 0 8px #6c47ff;
      animation: pulse 2s infinite;
    }

    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

    .pay-title {
      font-family: 'Syne', sans-serif;
      font-size: 30px; font-weight: 800;
      letter-spacing: -1px; margin-bottom: 6px;
    }

    .pay-title span {
      background: linear-gradient(135deg, #6c47ff, #00d2be);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    .pay-sub { font-size: 13px; color: rgba(240,238,255,0.4); margin-bottom: 28px; line-height: 1.6; }

    .amount-display {
      background: rgba(108,71,255,0.06); border: 1px solid rgba(108,71,255,0.15);
      border-radius: 14px; padding: 20px 24px;
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
    }

    .amount-label { font-size: 12px; color: rgba(240,238,255,0.4); font-weight: 500; }
    .amount-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; }
    .amount-token { font-size: 14px; color: rgba(240,238,255,0.5); margin-left: 6px; }

    .privacy-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }

    .privacy-row {
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
      border-radius: 10px; padding: 12px 16px;
    }

    .privacy-row-label { font-size: 13px; color: rgba(240,238,255,0.45); }

    .encrypted-badge {
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 600; letter-spacing: 0.5px; color: #00d2be;
      background: rgba(0,210,190,0.08); border: 1px solid rgba(0,210,190,0.2);
      padding: 3px 10px; border-radius: 20px;
    }

    .btn-pay {
      width: 100%; padding: 16px;
      background: linear-gradient(135deg, #6c47ff, #5538d4);
      border: none; border-radius: 12px; color: #fff;
      font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
      letter-spacing: -0.3px; cursor: pointer; transition: all 0.2s;
      position: relative; overflow: hidden;
    }

    .btn-pay::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
      opacity: 0; transition: opacity 0.2s;
    }

    .btn-pay:hover:not(:disabled)::before { opacity: 1; }
    .btn-pay:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 40px rgba(108,71,255,0.4); }
    .btn-pay:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .spinner {
      display: inline-block; width: 13px; height: 13px;
      border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.7s linear infinite;
      margin-right: 8px; vertical-align: middle;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .error-msg {
      color: #ff6b6b; font-size: 12px; margin-bottom: 12px;
      padding: 10px; background: rgba(255,107,107,0.06);
      border: 1px solid rgba(255,107,107,0.15); border-radius: 8px; text-align: center;
    }

    .footer-note {
      text-align: center; margin-top: 16px;
      font-size: 11px; color: rgba(240,238,255,0.18); letter-spacing: 0.3px;
    }

    .loading-page {
      min-height: 100vh; display: flex;
      align-items: center; justify-content: center; background: #080810;
    }
    .loading-text { font-size: 13px; color: rgba(240,238,255,0.25); letter-spacing: 0.5px; }

    .notfound { text-align: center; }
    .notfound-icon {
      width: 48px; height: 48px; border-radius: 50%;
      background: rgba(255,107,107,0.08); border: 1px solid rgba(255,107,107,0.2);
      display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
    }
    .notfound h2 {
      font-family: 'Syne', sans-serif; font-size: 20px;
      font-weight: 700; margin-bottom: 8px; letter-spacing: -0.3px;
    }
    .notfound p { font-size: 13px; color: rgba(240,238,255,0.35); line-height: 1.6; }

    .success-card { text-align: center; }

    .success-icon {
      width: 60px; height: 60px;
      background: rgba(0,210,190,0.08); border: 1px solid rgba(0,210,190,0.25);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .success-title {
      font-family: 'Syne', sans-serif; font-size: 26px;
      font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px;
    }

    .success-sub { font-size: 13px; color: rgba(240,238,255,0.4); line-height: 1.7; margin-bottom: 24px; }

    .tx-box {
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px; padding: 14px 16px;
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
    }

    .tx-label { font-size: 11px; color: rgba(240,238,255,0.25); letter-spacing: 0.5px; text-transform: uppercase; }
    .tx-value { font-size: 12px; font-family: monospace; color: rgba(240,238,255,0.5); }

    .proof-note {
      font-size: 11px; color: rgba(240,238,255,0.22); line-height: 1.6;
      padding: 12px 16px; background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;
    }

    .proof-note strong { color: rgba(240,238,255,0.4); }
  `;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-page">
        <div className="loading-text">Loading...</div>
      </div>
    </>
  );

  if (!link) return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="card">
          <div className="notfound">
            <div className="notfound-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2>Link not found</h2>
            <p>This payment link may have expired<br />or does not exist.</p>
          </div>
        </div>
      </div>
    </>
  );

  if (paid) return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="card">
          <div className="success-card">
            <div className="success-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d2be" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="success-title">Payment sent.</div>
            <div className="success-sub">
              Processed privately via Umbra on Solana.<br />
              No wallet address or amount is visible onchain.
            </div>
            {txSig && (
              <div className="tx-box">
                <div className="tx-label">Transaction</div>
                <div className="tx-value">{txSig}</div>
              </div>
            )}
            <div className="proof-note">
              Need to verify this payment? Request a <strong>viewing key</strong> from
              the recipient — it selectively decrypts this transaction for compliance or disputes,
              without exposing your full history.
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="card">
          <div className="privacy-badge">
            <div className="badge-dot" />
            Private payment · Umbra
          </div>

          <div className="pay-title">Pay <span>{link.label}</span></div>
          <div className="pay-sub">
            Powered by Umbra privacy protocol on Solana.
            Your wallet and transaction details are encrypted onchain.
          </div>

          <div className="amount-display">
            <div className="amount-label">Amount</div>
            <div>
              <span className="amount-value">{link.amount}</span>
              <span className="amount-token">{link.token}</span>
            </div>
          </div>

          <div className="privacy-rows">
            <div className="privacy-row">
              <div className="privacy-row-label">Recipient wallet</div>
              <div className="encrypted-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00d2be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Encrypted
              </div>
            </div>
            <div className="privacy-row">
              <div className="privacy-row-label">Your wallet</div>
              <div className="encrypted-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00d2be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Encrypted
              </div>
            </div>
            <div className="privacy-row">
              <div className="privacy-row-label">Amount onchain</div>
              <div className="encrypted-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00d2be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Encrypted
              </div>
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button className="btn-pay" onClick={handlePay} disabled={paying}>
            {paying
              ? <><span className="spinner" />Processing privately...</>
              : `Pay ${link.amount} ${link.token}`
            }
          </button>

          <div className="footer-note">
            Powered by Umbra · Solana · No data exposed onchain
          </div>
        </div>
      </div>
    </>
  );
}