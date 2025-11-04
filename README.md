# Base Transaction Visualizer

A real-time web application that visualizes blockchain transactions on the Base network (Layer 2). This MVP streams live block data including block numbers, transaction counts, and transaction hashes directly from the Base blockchain.

🌐 **Live Demo**: [https://base-transaction-visualizer.vercel.app/](https://base-transaction-visualizer.vercel.app/)

## 🌟 Features

- **Real-time Block Streaming**: Automatically updates as new blocks are mined on Base
- **Dual Network Polling**: Simultaneously tracks both Mainnet and Sepolia Testnet in the background
- **Instant Network Switching**: Switch between networks without waiting for blocks to load
- **Dynamic Block Display**: Adjustable slider to view 2-20 blocks instantly with caching
- **Live Transaction Feed**: Displays the latest blocks with transaction details
- **Block Information**: Shows block number, timestamp, transaction count, and gas usage
- **Transaction Links**: Click any transaction hash to view it on BaseScan
- **Network Utilization**: Real-time gas usage percentage (Gas Used ÷ Gas Limit)
- **Clean UI**: Modern, responsive design with smooth animations
- **Network Status**: Real-time connection indicator
- **Statistics Dashboard**: Track latest block, network utilization, and transaction counts
- **Gas Usage Chart**: Visual representation of gas consumption trends
- **Performance Metrics**: Average block time and transactions per second (TPS)
- **Network Toggle**: Switch between Base Mainnet and Sepolia Testnet instantly
- **Pause/Resume**: Control the live feed with a single click

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain SDK**: ethers.js v6
- **Network**: Base Mainnet (Layer 2)
- **RPC Provider**: Base official JSON-RPC endpoint (polling every 2 seconds)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/UsmanT12/Base-Transaction-Visualizer.git
   cd Base-Transaction-Visualizer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
base-transaction-visualizer/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main dashboard with block streaming
│   └── globals.css         # Global styles and Tailwind imports
├── components/
│   ├── BlockCard.tsx       # Reusable block information component
│   ├── TxList.tsx          # Transaction list component
│   └── GasChart.tsx        # Gas usage visualization chart
├── utils/
│   └── provider.ts         # ethers.js Base provider configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🎯 Key Features Explained

### � **Dual Network Polling**

The application runs two simultaneous polling loops - one for Base Mainnet and one for Sepolia Testnet. Both networks are continuously tracked in the background, caching up to 20 blocks each. When you switch networks, the cached data displays instantly with no waiting time.

### 🎚️ **Dynamic Block Display Slider**

Adjust the number of visible blocks from 2 to 20 using the slider control. The app maintains a cache of 20 blocks for each network, allowing instant updates as you move the slider. All metrics (TPS, gas usage, etc.) update in real-time based on visible blocks.

### �📊 **Network Utilization Metric**

Displays the average gas utilization percentage across visible blocks using the formula:

```
Utilization = (Gas Used ÷ Gas Limit) × 100%
```

This single metric provides a quick health check of network load. High percentages indicate busy periods, while low percentages show available capacity.

### 📈 **Gas Usage Chart**

A real-time bar chart showing gas consumption trends across visible blocks. Each bar represents one block's gas usage, with height proportional to the amount of gas consumed. Hover over bars to see exact values. The chart dynamically updates as you adjust the block display slider.

### ⏱️ **Average Block Time**

Calculates the average time between blocks based on visible blocks. On Base, this is typically around 2 seconds but can vary with network conditions. Updates instantly when you change the slider.

### 🚀 **TPS (Transactions Per Second)**

Real-time calculation of network throughput by dividing total transactions by the total time span of visible blocks. Provides insight into network activity level and updates dynamically with slider changes.

### 🔄 **Network Toggle**

Switch seamlessly between Base Mainnet and Sepolia Testnet with instant results. Both networks are cached independently, so switching is immediate with up to 20 blocks of historical data ready to display.

### ⏯️ **Pause/Resume Control**

Pause the live feed to examine current blocks in detail, or resume to continue tracking. When paused, both networks stop polling. The connection status indicator changes color to show the current state:

- 🟢 Green (pulsing) = Live streaming both networks
- 🟡 Yellow = Paused
- 🔴 Red = Disconnected

## 🧩 Core Components

### BlockCard Component

Displays individual block information with:

- Block number
- Timestamp
- Transaction count
- Gas used (formatted in millions)
- Gas limit
- List of up to 5 recent transactions

### TxList Component

Renders transaction hashes with:

- Truncated hash display (first 10 + last 8 characters)
- Links to BaseScan explorer
- External link indicator
- Hover effects
- Network-aware URLs (mainnet/testnet)

### GasChart Component

Visualizes gas usage with:

- Dynamic bar heights based on data range
- Gradient color scheme
- Hover tooltips with exact gas values
- Responsive scaling
- Updates based on visible blocks

### Provider Utility

Manages blockchain connections:

- Dual JSON-RPC provider setup (mainnet + testnet)
- Polling-based block fetching (2-second intervals)
- Network configuration for both networks
- Block explorer URL generation
- Provider lifecycle management

## 🌐 Network Configuration

The app connects to both Base networks simultaneously:

**Base Mainnet:**

- JSON-RPC: `https://mainnet.base.org`
- Explorer: `https://basescan.org`

**Base Sepolia Testnet:**

- JSON-RPC: `https://sepolia.base.org`
- Explorer: `https://sepolia.basescan.org`

Both networks are polled continuously with independent caches, allowing instant switching between them via the UI toggle.

## 📊 How It Works

1. **Dual Connection**: Establishes simultaneous JSON-RPC connections to both Base Mainnet and Sepolia Testnet
2. **Parallel Polling**: Both networks are polled independently every 2 seconds
3. **Smart Caching**: Maintains separate caches of up to 20 blocks for each network
4. **Fetching**: Retrieves full block data when new blocks are detected on either network
5. **Processing**: Extracts transaction hashes, counts, gas metrics, and metadata
6. **Dynamic Display**: UI shows blocks from the selected network with configurable slider (2-20 blocks)
7. **Instant Switching**: Toggle between networks to immediately view cached data
8. **Real-time Metrics**: All statistics (TPS, gas utilization, avg block time) update based on visible blocks

## 🎨 Features Breakdown

- ✅ **Read-only**: No wallet connection required - completely safe
- ✅ **Gas-free**: Only reads data, no transactions sent
- ✅ **Real-time**: Updates every ~2 seconds as blocks are mined
- ✅ **Dual Network**: Simultaneously tracks Mainnet and Testnet
- ✅ **Smart Caching**: Stores 20 blocks per network for instant access
- ✅ **Dynamic Display**: Adjustable slider for 2-20 blocks
- ✅ **Responsive**: Works on desktop, tablet, and mobile
- ✅ **Animated**: Smooth fade-in effects for new blocks
- ✅ **Interactive**: Clickable transaction links to explorer
- ✅ **Instant Switching**: Toggle networks without waiting
- ✅ **Live Metrics**: Real-time network utilization, TPS, and block time

## 🔧 Configuration

### Change Block Cache Size

In `app/page.tsx`, modify the cache limit for both networks:

```typescript
setMainnetBlocks((prev) => [newBlock, ...prev.slice(0, 19)]); // Keep last 20 blocks
setTestnetBlocks((prev) => [newBlock, ...prev.slice(0, 19)]); // Keep last 20 blocks
```

### Change Slider Range

Adjust the min/max values in the slider input:

```typescript
<input
  type="range"
  min="2" // Minimum blocks to display
  max="20" // Maximum blocks to display (should match cache size)
  value={maxBlocks}
  onChange={(e) => setMaxBlocks(Number(e.target.value))}
/>
```

### Change Transaction Display Count

In `app/page.tsx`, adjust the slice for transactions per block:

```typescript
const txs = block.transactions.slice(0, 5); // Show first 5 transactions
```

### Adjust Polling Frequency

Change the timeout interval for both polling loops:

```typescript
setTimeout(pollMainnetBlocks, 2000); // Poll every 2 seconds
setTimeout(pollTestnetBlocks, 2000); // Poll every 2 seconds
```

## 🐛 Troubleshooting

**Connection Issues:**

- Ensure you have internet connectivity
- Check if Base RPC endpoint is operational
- Try switching between mainnet and testnet

**Slow Updates:**

- Polling interval is set to 2 seconds
- Consider using Alchemy or Infura RPC endpoints for better reliability
- You can adjust polling frequency in `app/page.tsx`

**Build Errors:**

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 🔗 Links

- [Base Network](https://base.org)
- [BaseScan](https://basescan.org)
- [ethers.js Documentation](https://docs.ethers.org)
- [Next.js Documentation](https://nextjs.org/docs)

## 👨‍💻 Author

Built with ❤️ by [UsmanT12](https://github.com/UsmanT12)
