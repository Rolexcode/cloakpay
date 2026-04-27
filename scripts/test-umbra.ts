import { 
  createSignerFromPrivateKeyBytes,
  getUmbraClient, 
  getUserRegistrationFunction 
} from "@umbra-privacy/sdk";
import fs from "fs";
import crypto from "crypto";

const keypairPath = "./scripts/test-keypair.json";

async function main() {
  let keyBytes: Uint8Array;

  if (fs.existsSync(keypairPath)) {
    console.log("🔑 Loading existing keypair...");
    keyBytes = new Uint8Array(JSON.parse(fs.readFileSync(keypairPath, "utf8")));
  } else {
    console.log("🔑 Generating new keypair...");
    const keypair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
    const privateBytes = new Uint8Array(await crypto.subtle.exportKey("pkcs8", keypair.privateKey));
    const publicBytes = new Uint8Array(await crypto.subtle.exportKey("raw", keypair.publicKey));
    const seed = privateBytes.slice(-32);
    
    // 64 bytes = 32 seed + 32 public key
    keyBytes = new Uint8Array(64);
    keyBytes.set(seed, 0);
    keyBytes.set(publicBytes, 32);
    
    fs.writeFileSync(keypairPath, JSON.stringify(Array.from(keyBytes)));
    console.log("💾 Keypair saved!");
  }

  const signer = await createSignerFromPrivateKeyBytes(keyBytes);
  console.log("✅ Wallet address:", signer.address);
  console.log(`👉 Airdrop here: https://faucet.solana.com/?address=${signer.address}`);

  const client = await getUmbraClient({
    signer,
    network: "devnet",
    rpcUrl: "https://api.devnet.solana.com",
    rpcSubscriptionsUrl: "wss://api.devnet.solana.com",
    indexerApiEndpoint: "https://utxo-indexer.api.umbraprivacy.com",
  });
  console.log("✅ Umbra client created");

  const register = getUserRegistrationFunction({ client });
  const sigs = await register({ confidential: true, anonymous: false });
  console.log("✅ Registered! Signatures:", sigs.length);
}

main().catch(console.error);