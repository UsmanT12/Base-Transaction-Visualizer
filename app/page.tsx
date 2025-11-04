"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BlockCard, { BlockData } from "@/components/BlockCard";
import GasChart from "@/components/GasChart";
import { createBaseProvider } from "@/utils/provider";

export default function Home() {
  const [mainnetBlocks, setMainnetBlocks] = useState<BlockData[]>([]); // Cache for mainnet
  const [testnetBlocks, setTestnetBlocks] = useState<BlockData[]>([]); // Cache for testnet
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState<"mainnet" | "testnet">("mainnet");
  const [isPaused, setIsPaused] = useState(false);
  const [mainnetTotalTracked, setMainnetTotalTracked] = useState<number>(0);
  const [testnetTotalTracked, setTestnetTotalTracked] = useState<number>(0);
  const [maxBlocks, setMaxBlocks] = useState<number>(10); // Number of blocks to display (2-20)

  // Get the current network's blocks and total tracked
  const allBlocks = network === "mainnet" ? mainnetBlocks : testnetBlocks;
  const totalBlocksTracked =
    network === "mainnet" ? mainnetTotalTracked : testnetTotalTracked;

  // Get visible blocks based on slider value
  const visibleBlocks = allBlocks.slice(0, maxBlocks);

  // Calculate metrics from visible blocks only
  const visibleTotalTransactions = visibleBlocks.reduce(
    (sum, b) => sum + b.txCount,
    0
  );

  // Calculate network utilization (average gas usage %)
  const networkUtilization = (() => {
    const blocksWithGasData = visibleBlocks.filter(
      (b) => b.gasUsedRaw && b.gasLimit
    );
    if (blocksWithGasData.length === 0) return 0;

    const avgUtilization =
      blocksWithGasData.reduce(
        (sum, b) => sum + (b.gasUsedRaw! / b.gasLimit!) * 100,
        0
      ) / blocksWithGasData.length;

    return avgUtilization;
  })();

  // Calculate average block time and TPS from visible blocks
  const avgBlockTime = (() => {
    if (visibleBlocks.length >= 2) {
      const blockTimes = visibleBlocks
        .slice(0, -1)
        .map((b, i) => visibleBlocks[i + 1].blockTime || 0)
        .filter((t) => t > 0);

      if (blockTimes.length > 0) {
        return blockTimes.reduce((a, b) => a + b, 0) / blockTimes.length;
      }
    }
    return 0;
  })();

  const tps = (() => {
    if (visibleBlocks.length >= 2) {
      const blockTimes = visibleBlocks
        .slice(0, -1)
        .map((b, i) => visibleBlocks[i + 1].blockTime || 0)
        .filter((t) => t > 0);

      const totalTxs = visibleBlocks.reduce((sum, b) => sum + b.txCount, 0);
      const timeSpan = blockTimes.reduce((a, b) => a + b, 0);
      return timeSpan > 0 ? totalTxs / timeSpan : 0;
    }
    return 0;
  })();

  useEffect(() => {
    let mainnetProvider: ethers.JsonRpcProvider | null = null;
    let testnetProvider: ethers.JsonRpcProvider | null = null;
    let isActive = true;
    let mainnetLastBlockNumber = 0;
    let mainnetLastBlockTimestamp = 0;
    let testnetLastBlockNumber = 0;
    let testnetLastBlockTimestamp = 0;

    const connectAndListen = async () => {
      try {
        mainnetProvider = createBaseProvider("mainnet");
        testnetProvider = createBaseProvider("testnet");
        setIsConnected(true);
        setError(null);

        // Poll mainnet blocks every 2 seconds
        const pollMainnetBlocks = async () => {
          if (!isActive || !mainnetProvider || isPaused) {
            if (isActive && !isPaused) {
              setTimeout(pollMainnetBlocks, 2000);
            }
            return;
          }

          try {
            const currentBlockNumber = await mainnetProvider.getBlockNumber();

            // Only fetch if we have a new block
            if (currentBlockNumber > mainnetLastBlockNumber) {
              mainnetLastBlockNumber = currentBlockNumber;

              // Fetch block with transaction details
              const block = await mainnetProvider.getBlock(
                currentBlockNumber,
                true
              );

              if (!block) return;

              // Calculate block time (time since last block)
              const blockTime = mainnetLastBlockTimestamp
                ? block.timestamp - mainnetLastBlockTimestamp
                : 0;
              mainnetLastBlockTimestamp = block.timestamp;

              // Extract first 5 transaction hashes
              const txs = block.transactions.slice(0, 5).map((tx: any) => {
                return typeof tx === "string" ? tx : tx.hash;
              });

              // Format gas used
              const gasUsedRaw = Number(block.gasUsed);
              const gasUsed = block.gasUsed
                ? `${(gasUsedRaw / 1e6).toFixed(2)}M`
                : undefined;

              // Get gas limit
              const gasLimit = Number(block.gasLimit);

              const newBlock: BlockData = {
                number: block.number,
                txCount: block.transactions.length,
                timestamp: new Date(
                  block.timestamp * 1000
                ).toLocaleTimeString(),
                txs,
                gasUsed,
                gasUsedRaw,
                gasLimit,
                blockTime,
              };

              // Add new block to mainnet cache
              setMainnetBlocks((prev) => [newBlock, ...prev.slice(0, 19)]);
              setMainnetTotalTracked((prev) => prev + 1);

              // Clear any previous errors on successful fetch
              setError(null);
            }
          } catch (err) {
            console.error("Error fetching mainnet block:", err);
            // Only show error on initial connection issues
            if (mainnetLastBlockNumber === 0) {
              setError("Error fetching mainnet block data. Retrying...");
            }
          }

          // Continue polling
          if (isActive) {
            setTimeout(pollMainnetBlocks, 2000);
          }
        };

        // Poll testnet blocks every 2 seconds
        const pollTestnetBlocks = async () => {
          if (!isActive || !testnetProvider || isPaused) {
            if (isActive && !isPaused) {
              setTimeout(pollTestnetBlocks, 2000);
            }
            return;
          }

          try {
            const currentBlockNumber = await testnetProvider.getBlockNumber();

            // Only fetch if we have a new block
            if (currentBlockNumber > testnetLastBlockNumber) {
              testnetLastBlockNumber = currentBlockNumber;

              // Fetch block with transaction details
              const block = await testnetProvider.getBlock(
                currentBlockNumber,
                true
              );

              if (!block) return;

              // Calculate block time (time since last block)
              const blockTime = testnetLastBlockTimestamp
                ? block.timestamp - testnetLastBlockTimestamp
                : 0;
              testnetLastBlockTimestamp = block.timestamp;

              // Extract first 5 transaction hashes
              const txs = block.transactions.slice(0, 5).map((tx: any) => {
                return typeof tx === "string" ? tx : tx.hash;
              });

              // Format gas used
              const gasUsedRaw = Number(block.gasUsed);
              const gasUsed = block.gasUsed
                ? `${(gasUsedRaw / 1e6).toFixed(2)}M`
                : undefined;

              // Get gas limit
              const gasLimit = Number(block.gasLimit);

              const newBlock: BlockData = {
                number: block.number,
                txCount: block.transactions.length,
                timestamp: new Date(
                  block.timestamp * 1000
                ).toLocaleTimeString(),
                txs,
                gasUsed,
                gasUsedRaw,
                gasLimit,
                blockTime,
              };

              // Add new block to testnet cache
              setTestnetBlocks((prev) => [newBlock, ...prev.slice(0, 19)]);
              setTestnetTotalTracked((prev) => prev + 1);

              // Clear any previous errors on successful fetch
              setError(null);
            }
          } catch (err) {
            console.error("Error fetching testnet block:", err);
            // Only show error on initial connection issues
            if (testnetLastBlockNumber === 0) {
              setError("Error fetching testnet block data. Retrying...");
            }
          }

          // Continue polling
          if (isActive) {
            setTimeout(pollTestnetBlocks, 2000);
          }
        };

        // Start both polling loops
        pollMainnetBlocks();
        pollTestnetBlocks();
      } catch (err) {
        console.error("Connection error:", err);
        setError(
          "Failed to connect to Base network. Please check your connection."
        );
        setIsConnected(false);
      }
    };

    connectAndListen();

    // Cleanup on unmount
    return () => {
      isActive = false;
      if (mainnetProvider) {
        mainnetProvider.destroy();
      }
      if (testnetProvider) {
        testnetProvider.destroy();
      }
    };
  }, [isPaused]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-gray-950/80 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                Base Transaction Visualizer
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Real-time blockchain data from Base{" "}
                {network === "mainnet" ? "Mainnet" : "Sepolia Testnet"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Network Toggle */}
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setNetwork("mainnet")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    network === "mainnet"
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Mainnet
                </button>
                <button
                  onClick={() => setNetwork("testnet")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    network === "testnet"
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Testnet
                </button>
              </div>

              {/* Pause/Resume Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-blue-500 transition-colors text-sm font-medium"
              >
                {isPaused ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Resume
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
                    </svg>
                    Pause
                  </>
                )}
              </button>

              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected && !isPaused
                      ? "bg-green-500 animate-pulse"
                      : isPaused
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-400">
                  {isPaused ? "Paused" : isConnected ? "Live" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Block Display Control */}
        {visibleBlocks.length > 0 && (
          <div className="mb-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Blocks to Display: {maxBlocks}
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={maxBlocks}
                  onChange={(e) => setMaxBlocks(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                      ((maxBlocks - 2) / 18) * 100
                    }%, #374151 ${
                      ((maxBlocks - 2) / 18) * 100
                    }%, #374151 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2</span>
                  <span>20</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Currently showing</p>
                <p className="text-2xl font-bold text-blue-400">
                  {visibleBlocks.length}
                </p>
                <p className="text-xs text-gray-500">
                  of {totalBlocksTracked} tracked
                </p>
              </div>
            </div>
          </div>
        )}

        {allBlocks.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Waiting for new blocks...</p>
          </div>
        )}

        {/* Stats */}
        {visibleBlocks.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Latest Block</p>
                <p className="text-2xl font-bold text-blue-400">
                  #{visibleBlocks[0]?.number.toLocaleString() || "—"}
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">
                  Network Utilization
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {networkUtilization > 0
                    ? `${networkUtilization.toFixed(1)}%`
                    : "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Gas Used / Limit</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-purple-400">
                  {visibleTotalTransactions.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  across {visibleBlocks.length} blocks
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Avg Block Time</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {avgBlockTime > 0 ? `${avgBlockTime.toFixed(2)}s` : "—"}
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">TPS</p>
                <p className="text-2xl font-bold text-pink-400">
                  {tps > 0 ? tps.toFixed(1) : "—"}
                </p>
              </div>
            </div>

            {/* Gas Usage Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">
                  Gas Usage Trend
                </h3>
                <span className="text-xs text-gray-500">
                  Last {visibleBlocks.length} blocks
                </span>
              </div>
              <GasChart
                gasData={visibleBlocks
                  .slice()
                  .reverse()
                  .map((b) => b.gasUsedRaw || 0)}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Older</span>
                <span>Latest</span>
              </div>
            </div>
          </>
        )}

        {/* Block Feed */}
        <div>
          {visibleBlocks.map((block) => (
            <BlockCard key={block.number} block={block} network={network} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          <p>Built with Next.js, TypeScript, ethers.js, and Tailwind CSS</p>
          <p className="mt-2">
            Data from{" "}
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Base Network
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
