'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'annonceauto_install_dismissed_at';
const DISMISS_DAYS = 14;

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const jours = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (jours < DISMISS_DAYS) return;
    }

    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    if (isIOS && isSafari) {
      setPlatform('ios');
      setVisible(true);
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('android');
      setVisible(true);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  function fermer() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  async function installer() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible || !platform) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-basalte px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <img src="/icone-192.png" alt="" className="h-10 w-10 rounded-lg" />
        <div className="flex-1 text-sm text-vanille">
          {platform === 'android' ? (
            <>
              <p className="font-semibold">Installer Annonce Auto.re</p>
              <p className="text-vanille/60">Accède au site en un tap depuis ton écran d&apos;accueil.</p>
            </>
          ) : (
            <>
              <p className="font-semibold">Installer Annonce Auto.re</p>
              <p className="text-vanille/60">
                Appuie sur <span className="font-semibold">Partager</span> (⬆️) en bas de Safari,
                puis <span className="font-semibold">Sur l&apos;écran d&apos;accueil</span>.
              </p>
            </>
          )}
        </div>
        {platform === 'android' && (
          <button
            onClick={installer}
            className="shrink-0 rounded-full bg-lagon px-4 py-2 text-sm font-semibold text-basalte hover:bg-lagon2"
          >
            Installer
          </button>
        )}
        <button
          onClick={fermer}
          aria-label="Fermer"
          className="shrink-0 text-xl text-vanille/40 hover:text-vanille"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
