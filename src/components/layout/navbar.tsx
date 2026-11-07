"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import StaggeredMenu, { MenuItem, SocialItem } from '../ui/stageredMenu';

const menuItems: MenuItem[] = [
  { label: 'Home', ariaLabel: 'Back to Home Section', link: '#home' },
  { label: 'About', ariaLabel: 'About Konsera Section', link: '#about' },
  { label: 'Gallery', ariaLabel: 'Artist Gallery Section', link: '#gallery' },
];

const socialItems: SocialItem[] = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Twitter / X', link: 'https://twitter.com' },
];

const routesWithoutNavbar = ['/login', '/register', '/admin/login'];

export const Navbar = () => {
  const pathname = usePathname();

  if (routesWithoutNavbar.includes(pathname)) return null;

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex items-center justify-between p-[2em] z-30 pointer-events-none mix-blend-difference">
        <a
          href="#home"
          id="nav-logo"
          className="text-white font-logo tracking-widest text-xl uppercase pointer-events-auto no-underline"
        >
          KONSERA
        </a>
      </div>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="var(--color-text-primary)"
        openMenuButtonColor="var(--color-text-primary)"
        changeMenuColorOnOpen={true}
        colors={['var(--color-accent-pink)', 'var(--color-accent-lime)']}
        logoUrl=""
        accentColor="var(--color-accent-pink)"
        isFixed={true}
      />
    </>
  );
};

export default Navbar;
