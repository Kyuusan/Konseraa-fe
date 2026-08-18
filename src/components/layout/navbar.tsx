"use client";

import React from 'react';
import StaggeredMenu, { MenuItem, SocialItem } from '../ui/stageredMenu';

const menuItems: MenuItem[] = [
  { label: 'Global', ariaLabel: 'Global Shows', link: '/global' },
  { label: 'Domestik', ariaLabel: 'Domestic Gigs', link: '/domestic' },
  { label: 'Tentang', ariaLabel: 'About Us', link: '/about' }
];

const socialItems: SocialItem[] = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Twitter', link: 'https://twitter.com' }
];

export const Navbar = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full flex items-center justify-between p-[2em] z-30 pointer-events-none mix-blend-difference">
        <div id="nav-logo" className="text-white font-logo tracking-widest text-xl uppercase pointer-events-auto">
          KONSERA
        </div>
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