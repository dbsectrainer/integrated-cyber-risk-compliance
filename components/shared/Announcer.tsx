import React, { useEffect, useState } from 'react';

type Listener = (msg: string) => void;
const listeners = new Set<Listener>();

export function announce(message: string) {
  listeners.forEach((listener) => listener(message));
}

export const AnnouncerRegion: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAnnounce: Listener = (msg) => {
      setMessage('');
      // Trigger update so screen readers catch re-announcements of same message
      setTimeout(() => setMessage(msg), 50);
    };
    listeners.add(handleAnnounce);
    return () => {
      listeners.delete(handleAnnounce);
    };
  }, []);

  return (
    <div
      id="a11y-announcements"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

export const SkipLink: React.FC<{ targetId?: string }> = ({ targetId = 'main-content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 font-medium text-sm transition-all"
    >
      Skip to main content
    </a>
  );
};

