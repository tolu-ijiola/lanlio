"use client"

import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

function Header() {
  
  const path = usePathname()

  if (path.startsWith("/dashboard") || path.startsWith("/editor")) {
    return
  }

  return (
    <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] relative my-8 mx-auto flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-14 sm:h-16 md:h-18 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
                <div className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <Link href="/" className=" bg-transparent">
                      <Image src="/logo.svg" alt="logo" className="size-14" width={100} height={100} />
                    </Link>
                  </div>
                  <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 hidden sm:flex sm:flex-row sm:justify-start sm:items-start gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <div className="flex justify-start items-center">
                      <Link href="/pricing" className="flex flex-col hover:text-primary transition-all duration-300 justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        Pricing
                      </Link>
                    </div>
                    <div className="flex justify-start items-center">
                      <Link href="/learn" className="flex flex-col hover:text-primary transition-all duration-300 justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        Learn
                      </Link>
                    </div>
                    <div className="flex justify-start items-center">
                      <Link href="/templates" className="flex flex-col hover:text-primary transition-all duration-300 justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        Templates
                      </Link>
                    </div>
                  </div>
                </div>
                  <Button asChild className=" rounded-full">
                    <Link href="/register" className="flex justify-center text-xs md:text-[13px] items-center gap-2 leading-5 font-sans">
                    Sign up
                   
                    </Link>
                  </Button>
              </div>
            </div>
  )

  return (
    <div className="flex items-center text-sm justify-between p-4 mx-auto">
        <Link href="/" className="flex items-center gap-2" >
          <Image src="/logo.svg" alt="logo" className="size-10" width={100} height={100} />
          <span className="text-xl font-bold">Website.ai</span>
        </Link>
      <div className="flex items-center gap-4">
      <Link href="/" className=" p-2 px-4 rounded-full border hover:scale-105 duration-300 hover:bg-primary/5 hover:border-primary">Home</Link>
      <Link href="/pricing" className=" p-2 px-4 rounded-full border hover:scale-105 duration-300 hover:bg-primary/5 hover:border-primary">Pricing</Link>
      <Link href="/learn" className=" p-2 px-4 rounded-full border hover:scale-105 duration-300 hover:bg-primary/5 hover:border-primary">Learn</Link>

      </div>
      <Button asChild size={"lg"} className=" h-14">
        <Link href="/">
        Get Started
        <div className=" bg-white rounded-full p-2 text-black">
            <ArrowUpRight/>
        </div>
        </Link>
      </Button>
    </div>
  );
}

export default Header;
