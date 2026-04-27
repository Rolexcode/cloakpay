import fs from "fs";
import crypto from "crypto";

async function main() {
  // Generate a Solana-compatible keypair using Node built-in crypto
  const keypair = await crypto.subtle.generateKey(
    { name: "Ed25519" },
    true,
    ["sign", "verify"]
  );

  const privateKeyBytes = new Uint8Array(await crypto.subtle.exportKey("pkcs8", keypair.privateKey));
  const publicKeyBytes = new Uint8Array(await crypto.subtle.exportKey("raw", keypair.publicKey));

  // Save just the 32-byte seed (last 32 bytes of pkcs8) + public key
  const seed = privateKeyBytes.slice(-32);
  const fullKeypair = new Uint8Array(64);
  fullKeypair.set(seed);
  fullKeypair.set(publicKeyBytes, 32);

  fs.writeFileSync("./scripts/test-keypair.json", JSON.stringify(Array.from(fullKeypair)));

  // Base58 encode the public key for the address
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let num = BigInt("0x" + Buffer.from(publicKeyBytes).toString("hex"));
  let address = "";
  while (num > 0n) {
    address = chars[Number(num % 58n)] + address;
    num = num / 58n;
  }

  console.log("✅ Keypair saved to scripts/test-keypair.json");
  console.log("📬 Wallet address:", address);
  console.log(`👉 Airdrop here: https://faucet.solana.com/?address=${address}`);
}

main().catch(console.error);