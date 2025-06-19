export interface BrowserCapabilities {
  hasWebAssembly: boolean;
  hasSharedArrayBuffer: boolean;
  hasServiceWorker: boolean;
  isSecureContext: boolean;
  browserName: string;
  detectedAt: 'ultra-early' | 'early' | 'runtime' | 'fallback';
}