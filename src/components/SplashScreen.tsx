import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

export const SplashScreen: React.FC = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center z-50 animate-fade-out">
      <div className="text-center">
        <Logo size="lg" />
      </div>
    </div>
  );
};