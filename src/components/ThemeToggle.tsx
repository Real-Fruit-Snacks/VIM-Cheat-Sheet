import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../contexts/ThemeContext';
import { ChevronDown, Palette, Check } from 'lucide-react';

const themeLabels: Record<Theme, string> = {
  dark: 'Dark',
  light: 'Light',
  'high-contrast': 'High Contrast',
  'vim-classic': 'VIM Classic',
  'solarized-dark': 'Solarized Dark',
  'solarized-light': 'Solarized Light',
  monokai: 'Monokai',
};

const themeDescriptions: Record<Theme, string> = {
  dark: 'Default dark theme',
  light: 'Clean light theme',
  'high-contrast': 'Enhanced visibility',
  'vim-classic': 'Classic green terminal',
  'solarized-dark': 'Popular dark variant',
  'solarized-light': 'Popular light variant',
  monokai: 'Vibrant code editor theme',
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-primary bg-background-secondary hover:bg-background-tertiary border border-border rounded-md transition-colors"
        aria-label="Theme selector"
      >
        <Palette className="w-4 h-4 text-accent-primary" />
        <span>{themeLabels[theme]}</span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-background-secondary border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            {(Object.keys(themeLabels) as Theme[]).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => {
                  setTheme(themeOption);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                  theme === themeOption
                    ? 'bg-background-tertiary text-accent-primary'
                    : 'text-text-primary hover:bg-background-tertiary'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{themeLabels[themeOption]}</span>
                  <span className="text-xs text-text-muted">{themeDescriptions[themeOption]}</span>
                </div>
                {theme === themeOption && <Check className="w-4 h-4 text-accent-primary flex-shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}