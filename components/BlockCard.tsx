import React from "react";
import TxList from "./TxList";

export interface BlockData {
  number: number;
  txCount: number;
  timestamp: string;
  txs: string[];
  gasUsed?: string;
  gasUsedRaw?: number;
  gasLimit?: number;
  blockTime?: number;
}

interface BlockCardProps {
  block: BlockData;
  network?: "mainnet" | "testnet";
}

export default function BlockCard({
  block,
  network = "mainnet",
}: BlockCardProps) {
  return (
    <div className="mb-4 border border-gray-800 rounded-lg p-4 bg-gray-900 animate-fade-in hover:border-blue-500 transition-colors duration-300">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-blue-400">
          Block #{block.number.toLocaleString()}
        </h2>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
          {block.timestamp}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-400">Transactions</p>
          <p className="text-lg font-medium text-white">{block.txCount}</p>
        </div>
        {block.gasUsed && (
          <div>
            <p className="text-xs text-gray-400">Gas Used</p>
            <p className="text-lg font-medium text-white">{block.gasUsed}</p>
          </div>
        )}
      </div>

      {block.txs.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Recent Transactions:</p>
          <TxList txs={block.txs} network={network} />
        </div>
      )}
    </div>
  );
}
