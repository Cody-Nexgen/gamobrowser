/// <reference types="vite/client" />

interface Window {
  gamoWindow?: {
    getDesktopSnapshot: () => Promise<string>;
    createAccount: (account: {
      email: string;
      password: string;
    }) => Promise<{
      ok: boolean;
      account?: {
        id: string;
        email: string;
        createdAt: string;
      };
      error?: string;
      code?: string;
    }>;
    signIn: (account: {
      email: string;
      password: string;
    }) => Promise<{
      ok: boolean;
      account?: {
        id: string;
        email: string;
        createdAt: string;
      };
      error?: string;
      code?: string;
    }>;
    openDefaultBrowserSettings: () => Promise<{
      ok: boolean;
      error?: string;
    }>;
    saveOnboardingPreferences: (preferences: {
      theme: string;
      defaultBrowserChoice: string;
      importedBrowser: string | null;
      completed: boolean;
    }) => Promise<{
      ok: boolean;
      error?: string;
    }>;
    completeOnboarding: (preferences: {
      theme: string;
      defaultBrowserChoice: string;
      importedBrowser: string | null;
      completed: boolean;
    }) => Promise<{
      ok: boolean;
      error?: string;
    }>;
    enterWindowMode: () => void;
    minimize: () => void;
    toggleMaximize: () => void;
    close: () => void;
  };
}
