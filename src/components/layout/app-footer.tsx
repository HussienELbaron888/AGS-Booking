'use client';
import Image from 'next/image';

export function AppFooter() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-16">
      <div className="container mx-auto flex justify-center items-center">
        <Image
          src="/white logo.png"
          alt="Advanced Generations International Schools Logo"
          width={150}
          height={60}
          className="object-contain"
        />
      </div>
    </footer>
  );
}
