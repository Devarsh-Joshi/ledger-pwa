import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';
import { Button } from './ui/button';
import { setupInstallPrompt, showInstallPrompt, isAppInstalled } from '../utils/registerServiceWorker';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (isAppInstalled()) {
      setIsInstalled(true);
      return;
    }

    // Setup install prompt
    setupInstallPrompt(() => {
      // Show our custom prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    });
  }, []);

  const handleInstall = () => {
    showInstallPrompt();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('install-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || sessionStorage.getItem('install-prompt-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-6 text-white">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h3 className="text-white mb-1">Install Smart Ledger</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Install this app on your home screen for quick and easy access!
                </p>

                <Button
                  onClick={handleInstall}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl h-10"
                >
                  Install Now
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
