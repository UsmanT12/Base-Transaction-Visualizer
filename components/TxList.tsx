import React from "react";
import { getBlockExplorerUrl } from "@/utils/provider";

interface TxListProps {
  txs: string[];
  network?: "mainnet" | "testnet";
}

export default function TxList({ txs, network = "mainnet" }: TxListProps) {
  if (txs.length === 0) {
    return (
      <p className="text-xs text-gray-500 italic">No transactions to display</p>
    );
  }

  return (
    <ul className="space-y-1">
      {txs.map((tx, index) => (
        <li
          key={`${tx}-${index}`}
          className="text-xs font-mono bg-gray-800 p-2 rounded hover:bg-gray-750 transition-colors"
        >
          <a
            href={getBlockExplorerUrl(tx, network)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2"
          >
            <span className="truncate">
              {tx.slice(0, 10)}...{tx.slice(-8)}
            </span>
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
