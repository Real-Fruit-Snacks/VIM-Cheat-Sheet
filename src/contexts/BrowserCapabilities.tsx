import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { BrowserCapabilities } from './browser-capabilities-types';

const BrowserCapabilitiesContext = createContext<BrowserCapabilities | null>(null);

export const BrowserCapabilitiesProvider: React.FC<{
  children: ReactNode;
  capabilities: BrowserCapabilities;
}> = ({ children, capabilities }) => {
  return (
    <BrowserCapabilitiesContext.Provider value={capabilities}>
      {children}
    </BrowserCapabilitiesContext.Provider>
  );
};

export const useBrowserCapabilities = () => {
  const context = useContext(BrowserCapabilitiesContext);
  if (!context) {
    throw new Error('useBrowserCapabilities must be used within BrowserCapabilitiesProvider');
  }
  return context;
};