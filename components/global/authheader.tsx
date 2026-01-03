"use client"

import React from 'react'
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';

function AuthHeader() {
  return (
    <div className="block md:hidden w-full h-12 sm:h-14 relative my-4 sm:my-6 mx-auto flex justify-center items-center z-50 px-4 sm:px-6">
      <div className="w-full h-0 absolute left-0 top-6 sm:top-7 border-t border-border/50 dark:border-border/60"></div>
      
      <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-24px)] sm:max-w-[calc(100%-32px)] h-12 sm:h-14 py-1.5 sm:py-2 px-3 sm:px-4 bg-[#F7F5F3] dark:bg-muted/80 backdrop-blur-sm border border-border/50 dark:border-border/60 shadow-sm dark:shadow-lg overflow-hidden rounded-[50px] flex justify-between items-center z-50">
        <Link href="/dashboard" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Image src="/logo.svg" alt="logo" className="size-8 sm:size-10" width={40} height={40} />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default AuthHeader