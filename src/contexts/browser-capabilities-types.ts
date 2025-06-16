export interface BrowserCapabilities {
  hasWebAssembly: boolean;
  hasSharedArrayBuffer: boolean;
  hasServiceWorker: boolean;
  isSecureContext: boolean;
  browserName: string;
  detectedAt: 'early' | 'runtime';
}