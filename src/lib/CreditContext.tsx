import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CreditTransaction, PromoCode, PromoRedemption, UserRole } from '../types';
import { useAuth } from './AuthContext';

interface CreditContextType {
  credits: number;
  userRole: UserRole;
  transactions: CreditTransaction[];
  promoCodes: PromoCode[];
  promoRedemptions: PromoRedemption[];
  isPaywallOpen: boolean;
  isAdModalOpen: boolean;
  deductCredits: (amount: number, action: string, provider?: string) => boolean;
  addCredits: (amount: number, reason: string) => void;
  redeemPromoCode: (codeStr: string, userName: string, phoneNumber?: string) => { success: boolean; message: string; creditsGranted: number };
  createPromoCode: (code: string, credits: number, description?: string, maxUses?: number) => boolean;
  updatePromoCodeCredits: (code: string, newCredits: number) => boolean;
  deletePromoCode: (code: string) => boolean;
  togglePromoCodeStatus: (code: string) => boolean;
  watchRewardAdSuccess: () => void;
  openPaywall: () => void;
  closePaywall: () => void;
  openAdModal: () => void;
  closeAdModal: () => void;
  setUserRole: (role: UserRole) => void;
  adminAdjustCredits: (newBalance: number, reason: string) => void;
}

const DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    code: 'gurjarj44',
    credits: 500,
    description: 'Master Owner / VIP Creator Access (+500 Credits Boost)',
    active: true,
    timesUsed: 1,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    code: 'WELCOME100',
    credits: 100,
    description: 'New Pioneer Welcome Grant (+100 Credits)',
    active: true,
    timesUsed: 4,
    createdAt: '2026-09-10T00:00:00.000Z',
  },
  {
    code: 'ASTRA50',
    credits: 50,
    description: 'Community Builder Perk (+50 Credits)',
    active: true,
    timesUsed: 9,
    createdAt: '2026-09-15T00:00:00.000Z',
  },
  {
    code: 'ASTRA20',
    credits: 20,
    description: 'Quick Booster (+20 Credits)',
    active: true,
    timesUsed: 18,
    createdAt: '2026-09-20T00:00:00.000Z',
  },
];

const INITIAL_REDEMPTIONS: PromoRedemption[] = [
  {
    id: 'red-01',
    userName: 'Jaydeep Gurjar',
    phoneNumber: '+91 98765 43210',
    code: 'gurjarj44',
    creditsGranted: 500,
    timestamp: Date.now() - 3600000 * 24,
  },
  {
    id: 'red-02',
    userName: 'Elena Rostova',
    phoneNumber: '+1 415 555 2671',
    code: 'WELCOME100',
    creditsGranted: 100,
    timestamp: Date.now() - 3600000 * 12,
  },
  {
    id: 'red-03',
    userName: 'Kaelen Vance',
    phoneNumber: '+44 7700 900123',
    code: 'ASTRA50',
    creditsGranted: 50,
    timestamp: Date.now() - 3600000 * 4,
  },
];

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, userProfile } = useAuth();

  // Load initial credits
  const [credits, setCredits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('astra-credits');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {}
    return 350; // Generous 350 starting credits matching master reference
  });

  // User role state
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem('astra-user-role') as UserRole;
      if (savedRole) return savedRole;
    } catch {}
    return 'OWNER'; // Default to OWNER in AI Studio session for Jaydeep Gurjar
  });

  // Check if current user is owner email
  useEffect(() => {
    const email = currentUser?.email || userProfile?.email;
    if (email?.toLowerCase().includes('gurjar') || email === 'gurjarjaydeep402@gmail.com') {
      setUserRole('OWNER');
    }
  }, [currentUser, userProfile]);

  // Promo codes list
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('astra-promo-codes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROMO_CODES;
  });

  // Promo redemptions log
  const [promoRedemptions, setPromoRedemptions] = useState<PromoRedemption[]>(() => {
    try {
      const saved = localStorage.getItem('astra-promo-redemptions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_REDEMPTIONS;
  });

  // Transaction history
  const [transactions, setTransactions] = useState<CreditTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('astra-credit-transactions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'tx-init',
        action: 'Account Provisioning',
        amount: 100,
        timestamp: Date.now() - 86400000,
        provider: 'ASTRA System',
        status: 'completed',
        reason: 'Welcome Trial Grant (100 Credits)',
      },
    ];
  });

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('astra-credits', credits.toString());
      localStorage.setItem('astra-user-role', userRole);
      localStorage.setItem('astra-promo-codes', JSON.stringify(promoCodes));
      localStorage.setItem('astra-promo-redemptions', JSON.stringify(promoRedemptions));
      localStorage.setItem('astra-credit-transactions', JSON.stringify(transactions));
    } catch (e) {
      console.warn('Storage sync failed:', e);
    }
  }, [credits, userRole, promoCodes, promoRedemptions, transactions]);

  // Deduct credits for an action
  const deductCredits = (amount: number, action: string, provider = 'ASTRA Engine'): boolean => {
    // Owner with unlimited access bypasses deduction if desired or executes smoothly
    if (userRole === 'OWNER' && credits < amount) {
      // Owner credit auto-topup
      setCredits((prev) => prev + 500);
      return true;
    }

    if (credits < amount) {
      setIsPaywallOpen(true);
      return false;
    }

    setCredits((prev) => {
      const next = prev - amount;
      return next < 0 ? 0 : next;
    });

    const tx: CreditTransaction = {
      id: crypto.randomUUID(),
      action,
      amount: -amount,
      timestamp: Date.now(),
      provider,
      status: 'completed',
    };
    setTransactions((prev) => [tx, ...prev]);

    return true;
  };

  // Add credits manually or via refill
  const addCredits = (amount: number, reason: string) => {
    setCredits((prev) => prev + amount);
    const tx: CreditTransaction = {
      id: crypto.randomUUID(),
      action: 'Credit Addition',
      amount: amount,
      timestamp: Date.now(),
      provider: 'ASTRA Central Ledger',
      status: 'completed',
      reason,
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  // Admin adjust credits
  const adminAdjustCredits = (newBalance: number, reason: string) => {
    const delta = newBalance - credits;
    setCredits(newBalance);
    const tx: CreditTransaction = {
      id: crypto.randomUUID(),
      action: 'Admin Override',
      amount: delta,
      timestamp: Date.now(),
      provider: 'System Admin Console',
      status: 'completed',
      reason,
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  // Redeem a promo code
  const redeemPromoCode = (
    codeStr: string,
    userName: string,
    phoneNumber?: string
  ): { success: boolean; message: string; creditsGranted: number } => {
    const cleanCode = codeStr.trim().toLowerCase();
    const found = promoCodes.find((p) => p.code.toLowerCase() === cleanCode);

    if (!found) {
      return { success: false, message: `Promo code "${codeStr}" is invalid or does not exist.`, creditsGranted: 0 };
    }

    if (!found.active) {
      return { success: false, message: `Promo code "${found.code}" has expired or is deactivated.`, creditsGranted: 0 };
    }

    // Check if user already redeemed this code
    const alreadyRedeemed = promoRedemptions.some(
      (r) => r.code.toLowerCase() === cleanCode && r.userName.toLowerCase() === userName.trim().toLowerCase()
    );

    if (alreadyRedeemed && found.code !== 'gurjarj44') {
      return { success: false, message: `You have already redeemed code "${found.code}". Single redemption per user.`, creditsGranted: 0 };
    }

    const granted = found.credits;

    // Grant credits
    setCredits((prev) => prev + granted);

    // Record redemption
    const newRedemption: PromoRedemption = {
      id: crypto.randomUUID(),
      userName: userName.trim() || 'Astra Pioneer',
      phoneNumber: phoneNumber?.trim() || 'Not specified',
      code: found.code,
      creditsGranted: granted,
      timestamp: Date.now(),
      userId: currentUser?.uid,
    };
    setPromoRedemptions((prev) => [newRedemption, ...prev]);

    // Increment code usage
    setPromoCodes((prev) =>
      prev.map((item) =>
        item.code.toLowerCase() === cleanCode ? { ...item, timesUsed: item.timesUsed + 1 } : item
      )
    );

    // Ledger record
    const tx: CreditTransaction = {
      id: crypto.randomUUID(),
      action: `Promo Code Redeemed: ${found.code}`,
      amount: granted,
      timestamp: Date.now(),
      provider: 'Promo Engine',
      status: 'completed',
      reason: `Activated by ${userName}${phoneNumber ? ` (${phoneNumber})` : ''}`,
    };
    setTransactions((prev) => [tx, ...prev]);

    return {
      success: true,
      message: `Success! Code "${found.code}" redeemed. Granted +${granted} Astra Credits.`,
      creditsGranted: granted,
    };
  };

  // CRUD for promo codes
  const createPromoCode = (code: string, amount: number, description = 'Custom promotional grant', maxUses = 100): boolean => {
    const trimmed = code.trim();
    if (!trimmed) return false;
    if (promoCodes.some((p) => p.code.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    const newPromo: PromoCode = {
      code: trimmed,
      credits: amount,
      description,
      active: true,
      maxUses,
      timesUsed: 0,
      createdAt: new Date().toISOString(),
    };
    setPromoCodes((prev) => [newPromo, ...prev]);
    return true;
  };

  const updatePromoCodeCredits = (code: string, newCredits: number): boolean => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.code.toLowerCase() === code.toLowerCase() ? { ...p, credits: newCredits } : p))
    );
    return true;
  };

  const deletePromoCode = (code: string): boolean => {
    // Preserve master owner code or allow toggle
    setPromoCodes((prev) => prev.filter((p) => p.code.toLowerCase() !== code.toLowerCase()));
    return true;
  };

  const togglePromoCodeStatus = (code: string): boolean => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.code.toLowerCase() === code.toLowerCase() ? { ...p, active: !p.active } : p))
    );
    return true;
  };

  // Watch reward ad success
  const watchRewardAdSuccess = () => {
    const REWARD = 5;
    setCredits((prev) => prev + REWARD);
    const tx: CreditTransaction = {
      id: crypto.randomUUID(),
      action: 'Ad Reward Claimed',
      amount: REWARD,
      timestamp: Date.now(),
      provider: 'Astra Partner Ad Network',
      status: 'completed',
      reason: 'Rewarded ad view verified (+5 Credits)',
    };
    setTransactions((prev) => [tx, ...prev]);
    setIsAdModalOpen(false);
  };

  return (
    <CreditContext.Provider
      value={{
        credits,
        userRole,
        transactions,
        promoCodes,
        promoRedemptions,
        isPaywallOpen,
        isAdModalOpen,
        deductCredits,
        addCredits,
        redeemPromoCode,
        createPromoCode,
        updatePromoCodeCredits,
        deletePromoCode,
        togglePromoCodeStatus,
        watchRewardAdSuccess,
        openPaywall: () => setIsPaywallOpen(true),
        closePaywall: () => setIsPaywallOpen(false),
        openAdModal: () => setIsAdModalOpen(true),
        closeAdModal: () => setIsAdModalOpen(false),
        setUserRole,
        adminAdjustCredits,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
}
