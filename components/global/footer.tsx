"use client"

import Link from "next/link";
import Image from "next/image";
import { Mail, Instagram, Facebook, Twitter, Github } from "lucide-react";
import { usePathname } from "next/navigation";

function Footer() {

  const path = usePathname()

  if (path.startsWith("/dashboard") || path.startsWith("/editor")) {
    return
  }

  return (
    <footer className="bg-background border-t mt-20 border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" className="size-8" width={32} height={32} />
          </Link>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Learn
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="mailto:hello@website.ai" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Website.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


