// src/app/page.tsx
import WalletInterface from '@/components/wallet';

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <WalletInterface />
    </div>
  );
}