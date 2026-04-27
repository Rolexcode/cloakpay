import {
  createSignerFromPrivateKeyBytes,
  getUmbraClient,
} from "@umbra-privacy/sdk";

export async function getClient(privateKeyBytes: Uint8Array) {
  const signer = await createSignerFromPrivateKeyBytes(privateKeyBytes);

  const client = await getUmbraClient({
    signer,
    network: "devnet",
    rpcUrl: "https://api.devnet.solana.com",
    rpcSubscriptionsUrl: "wss://api.devnet.solana.com",
    indexerApiEndpoint: "https://utxo-indexer.api.umbraprivacy.com",
  });

  return { client, signer };
}