'use client';
import Image from 'next/image';

export function AppFooter() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-16">
      <div className="container mx-auto flex flex-col justify-center items-center gap-4">
        <Image
          src="/white logo.png"
          alt="Advanced Generations International Schools Logo"
          width={150}
          height={60}
          className="object-contain"
        />
        <p className="text-sm text-center text-primary-foreground/80">
          All Rights reserved to AGS | 2025 - Design & Developed by Pixelle®
        </p>
      </div>
    </footer>
  );
}
