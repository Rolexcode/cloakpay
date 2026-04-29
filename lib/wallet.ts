import { createSignerFromWalletAccount, getUmbraClient } from "@umbra-privacy/sdk";
import { getWallets } from "@wallet-standard/app";

export async function getClientFromWallet() {
  const { get } = getWallets();
  const wallets = get();

  // Filter for wallets that support both required features
  const compatible = wallets.filter((w) => {
    const features = Object.keys(w.features);
    return (
      features.includes("solana:signTransaction") &&
      features.includes("solana:signMessage")
    );
  });

  if (!compatible.length) {
    throw new Error("No compatible wallet found. Please install Phantom.");
  }

  const wallet = compatible[0];

  // Connect
  const connectFeature = wallet.features["standard:connect"] as any;
  const { accounts } = await connectFeature.connect();
  if (!accounts.length) throw new Error("No accounts found.");

  const account = accounts[0];

  // Create signer — this routes signMessage + signTransaction through Phantom
  const signer = createSignerFromWalletAccount(wallet, account);

  const client = await getUmbraClient({
    signer,
    network: "devnet",
    rpcUrl: "https://api.devnet.solana.com",
    rpcSubscriptionsUrl: "wss://api.devnet.solana.com",
    indexerApiEndpoint: "https://utxo-indexer.api.umbraprivacy.com",
  });

  return { client, signer, address: account.address };
}