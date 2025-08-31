# FlappyStark 🐦⚡

A Flappy Bird game integrated with StarkNet that allows players to generate transactions while playing. Developed with Next.js, TypeScript, and Cavos for authentication and transactions on StarkNet.

## 🚀 Features

- **Classic Game**: Flappy Bird with improved mechanics
- **Web3 Authentication**: Registration and login with Cavos
- **Automatic Transactions**: Generate transactions on StarkNet for each obstacle overcome
- **Transaction System**: Different types of transactions based on game performance
- **User Profile**: Dashboard with statistics and transactions
- **Automatic Wallet**: Created automatically upon registration

## 🛠️ Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **Blockchain**: StarkNet, Cavos SDK
- **Authentication**: Cavos Auth
- **Transactions**: Cavos Transactions

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- [Cavos](https://services.cavos.xyz) account

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd FlappyStark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and configure your Cavos credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Cavos Configuration
NEXT_PUBLIC_CAVOS_APP_ID=your-cavos-app-id
NEXT_PUBLIC_CAVOS_ORG_SECRET=your-cavos-org-secret
NEXT_PUBLIC_CAVOS_NETWORK=mainnet

# Development settings
NODE_ENV=development
```

### 4. Get Cavos credentials

1. Go to [Cavos Services](https://services.cavos.xyz)
2. Create a new application
3. Copy the `App ID` and `Organization Secret`
4. Configure the network (mainnet for production)

## 🎮 How to play

1. **Register/Login**: Create an account or sign in
2. **Select Character**: Choose your favorite character
3. **Play**: Click or press SPACE to fly
4. **Generate Transactions**: Each obstacle overcome generates a transaction on StarkNet
5. **View Transactions**: Check your profile to see your transaction history

## 💰 Transaction System

- **Score Transaction**: Transaction for each obstacle overcome
- **Achievement Transaction**: Transaction for special achievements
- **Reward Transaction**: Transaction when completing the game

> **Note**: In this demo version, transactions are simulated. In production, real transactions would be executed on StarkNet.

## 🔧 Development

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── api/               # API Routes
│   │   └── execute/       # Endpoint to execute transactions
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Main layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── auth/             # Authentication components
│   │   ├── login-form.tsx     # Login form
│   │   ├── register-form.tsx  # Registration form
│   │   └── user-profile.tsx   # User profile
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx         # Custom button
│   │   ├── card.tsx           # Card
│   │   ├── game-overlay.tsx   # Game overlay
│   │   ├── navigation-header.tsx # Navigation header
│   │   ├── setting-item.tsx   # Setting item
│   │   ├── settings-section.tsx # Settings section
│   │   ├── slider.tsx         # Slider
│   │   ├── stat-card.tsx      # Statistics card
│   │   ├── switch.tsx         # Switch toggle
│   │   └── tab-navigation.tsx # Tab navigation
│   ├── character-select.tsx   # Character selection
│   ├── game-screen.tsx        # Game screen
│   ├── main-menu.tsx          # Main menu
│   ├── options-screen.tsx     # Options screen
│   └── records-screen.tsx     # Records screen
├── hooks/                # Custom hooks
│   ├── use-auth.ts           # Authentication hook
│   ├── use-mobile.ts         # Mobile detection hook
│   ├── use-toast.ts          # Notifications hook
│   └── use-transactions.ts   # Transactions hook
└── lib/                  # Utilities and services
    ├── cavos-auth.ts         # Cavos authentication service
    ├── cavos-transactions.ts # Transactions service
    ├── game-storage.ts       # Game storage
    ├── types.ts              # TypeScript types
    └── utils.ts              # General utilities
```

## 🔐 Authentication with Cavos

The project uses Cavos for:

- **User registration** with automatic wallet
- **Secure login** with JWT tokens
- **Session management** with automatic refresh
- **Transaction execution** on StarkNet

## 💡 Technical Features

- **Web3 Authentication**: No need to manually connect wallet
- **Automatic Transactions**: Execute automatically during gameplay
- **Synchronization**: Transactions sync with the blockchain
- **Persistence**: Data is saved locally and in Cavos
- **Responsive**: Adaptive design for mobile and desktop

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 🆘 Support

If you have issues:

1. Verify that Cavos credentials are correct
2. Make sure you're on the correct network (mainnet)
3. Check the browser console for errors
4. Consult the [Cavos documentation](https://docs.cavos.xyz)

## 🔗 Useful Links

- [Cavos Documentation](https://docs.cavos.xyz)
- [StarkNet Documentation](https://docs.starknet.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
