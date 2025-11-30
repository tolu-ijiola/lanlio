"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, RefreshCw, FileText, Percent, Pen, MessageSquare, RotateCcw, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                {/* 4-leaf clover shape */}
                <path
                  d="M50 20C45 20 40 22 36 26C32 30 30 35 30 40C30 50 40 60 50 70C60 60 70 50 70 40C70 35 68 30 64 26C60 22 55 20 50 20Z"
                  fill="#30AF56"
                />
                <path
                  d="M20 50C20 45 22 40 26 36C30 32 35 30 40 30C50 30 60 40 70 50C60 60 50 70 40 70C35 70 30 68 26 64C22 60 20 55 20 50Z"
                  fill="#30AF56"
                />
                <path
                  d="M50 80C55 80 60 78 64 74C68 70 70 65 70 60C70 50 60 40 50 30C40 40 30 50 30 60C30 65 32 70 36 74C40 78 45 80 50 80Z"
                  fill="#30AF56"
                />
                <path
                  d="M80 50C80 55 78 60 74 64C70 68 65 70 60 70C50 70 40 60 30 50C40 40 50 30 60 30C65 30 70 32 74 36C78 40 80 45 80 50Z"
                  fill="#30AF56"
                />
                {/* Center circle */}
                <circle cx="50" cy="50" r="12" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Liner</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">Templates</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">Community</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">Tools</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">Pricing</a>
          </nav>

          {/* Login Button */}
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
            Login
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background with radial gradient, curvy lines, and clover icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Radial gradient - subtle light green */}
              <div 
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(48, 175, 86, 0.15) 0%, rgba(48, 175, 86, 0.08) 30%, rgba(48, 175, 86, 0.03) 50%, transparent 70%)',
                }}
              />
              
              {/* Curvy decorative lines */}
              <svg 
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: 1, opacity: 0.4 }}
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
              >
                {/* Curvy lines radiating from center */}
                <path
                  d="M600 400 Q450 250 300 400"
                  stroke="rgba(48, 175, 86, 0.4)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M600 400 Q750 250 900 400"
                  stroke="rgba(48, 175, 86, 0.4)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M600 400 Q500 200 600 100"
                  stroke="rgba(48, 175, 86, 0.4)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M600 400 Q700 200 600 100"
                  stroke="rgba(48, 175, 86, 0.4)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M600 400 Q500 600 600 700"
                  stroke="rgba(48, 175, 86, 0.4)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M600 400 Q700 600 600 700"
                  stroke="rgba(48, 175, 86, 0.4)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Circular decorative lines */}
                <circle cx="600" cy="400" r="180" stroke="rgba(48, 175, 86, 0.25)" strokeWidth="1.5" fill="none" strokeDasharray="8,4" />
                <circle cx="600" cy="400" r="240" stroke="rgba(48, 175, 86, 0.2)" strokeWidth="1" fill="none" strokeDasharray="6,3" />
                {/* Wavy/organic curved lines */}
                <path
                  d="M200 300 Q300 350 400 300 Q500 250 600 300"
                  stroke="rgba(48, 175, 86, 0.3)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M200 500 Q300 450 400 500 Q500 550 600 500"
                  stroke="rgba(48, 175, 86, 0.3)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M800 300 Q700 350 600 300 Q500 250 400 300"
                  stroke="rgba(48, 175, 86, 0.3)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M800 500 Q700 450 600 500 Q500 550 400 500"
                  stroke="rgba(48, 175, 86, 0.3)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Central clover icon - darker green */}
              <div className="absolute z-20" style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}>
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  {/* 4-leaf clover shape */}
                  <path
                    d="M50 20C45 20 40 22 36 26C32 30 30 35 30 40C30 50 40 60 50 70C60 60 70 50 70 40C70 35 68 30 64 26C60 22 55 20 50 20Z"
                    fill="#0d5a2a"
                  />
                  <path
                    d="M20 50C20 45 22 40 26 36C30 32 35 30 40 30C50 30 60 40 70 50C60 60 50 70 40 70C35 70 30 68 26 64C22 60 20 55 20 50Z"
                    fill="#0d5a2a"
                  />
                  <path
                    d="M50 80C55 80 60 78 64 74C68 70 70 65 70 60C70 50 60 40 50 30C40 40 30 50 30 60C30 65 32 70 36 74C40 78 45 80 50 80Z"
                    fill="#0d5a2a"
                  />
                  <path
                    d="M80 50C80 55 78 60 74 64C70 68 65 70 60 70C50 70 40 60 30 50C40 40 50 30 60 30C65 30 70 32 74 36C78 40 80 45 80 50Z"
                    fill="#0d5a2a"
                  />
                  {/* Center circle */}
                  <circle cx="50" cy="50" r="12" fill="white" />
                </svg>
              </div>

              {/* Four icons arranged around clover in circular pattern */}
              <div className="absolute z-20" style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%', width: '300px', height: '300px' }}>
                {/* Top icon - Lightning (0 degrees / top) */}
                <div 
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '0%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Zap className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                
                {/* Right icon - Refresh (90 degrees / right) */}
                <div 
                  className="absolute"
                  style={{
                    right: '0%',
                    top: '50%',
                    transform: 'translate(50%, -50%)',
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <RefreshCw className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                
                {/* Bottom icon - FileText (180 degrees / bottom) */}
                <div 
                  className="absolute"
                  style={{
                    left: '50%',
                    bottom: '0%',
                    transform: 'translate(-50%, 50%)',
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                
                {/* Left icon - Percent (270 degrees / left) */}
                <div 
                  className="absolute"
                  style={{
                    left: '0%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Percent className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-20 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Text to Design in Minutes, Powered by AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Generate beautiful and editable web designs from a simple text description. It empowers you to design faster than ever.
            </p>
            <Button 
              className="bg-[#30AF56] hover:bg-[#2a9a4d] text-white px-10 py-7 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Generate Your Website
            </Button>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
          {/* Left Column - Playground */}
          <div className="lg:col-span-2 space-y-8">
            {/* Playground Section */}
            <section>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Playground</h2>
              
              {/* Input Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Create a stunning photography agency landing page."
                      className="w-full h-12 text-base border-gray-300 focus:border-[#30AF56] focus:ring-[#30AF56] pr-32"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-500">
                      <Pen className="w-4 h-4" />
                      <span className="text-xs">Describe your website</span>
                    </div>
                  </div>
                  <Button 
                    className="bg-[#30AF56] hover:bg-[#2a9a4d] text-white px-8 h-12 rounded-lg font-medium whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
              </div>

              {/* Preview Section */}
              <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Left Sidebar */}
                <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-200 bg-gray-50 flex flex-col items-center py-4 gap-4 z-10">
                  <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600">1</div>
                  <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600">2</div>
                  <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600">3</div>
                </div>

                {/* Right Sidebar */}
                <div className="absolute right-0 top-0 bottom-0 w-64 border-l border-gray-200 bg-gray-50 p-4 z-10">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Position</div>
                      <div className="text-sm text-gray-900">0, 0</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Width</div>
                      <div className="text-sm text-gray-900">100%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Height</div>
                      <div className="text-sm text-gray-900">Auto</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Device</div>
                      <div className="text-sm text-gray-900">Desktop</div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="ml-16 mr-64">
                  {/* Editor Toolbar */}
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                      <span className="text-sm text-gray-600">Landing page</span>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="p-8">
                    <div className="border border-gray-200 rounded-lg p-6 bg-white">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                        <div className="text-lg font-semibold text-gray-900">Logoipsum</div>
                        <nav className="flex items-center gap-6 text-sm text-gray-600">
                          <a href="#" className="hover:text-gray-900">Home</a>
                          <a href="#" className="hover:text-gray-900">About</a>
                          <a href="#" className="hover:text-gray-900">Portfolio</a>
                          <a href="#" className="hover:text-gray-900">Contact</a>
                        </nav>
                      </div>

                      {/* Hero Content */}
                      <div className="grid grid-cols-2 gap-8 items-center">
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-4">CREATE YOUR BEAUTIFUL MOMENT</h3>
                          <p className="text-gray-600 leading-relaxed">
                            Capture life's precious moments with our professional photography services. We bring your vision to life through stunning imagery.
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg aspect-[4/3] flex items-center justify-center">
                          <div className="text-gray-400 text-sm">Image</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-12">
            {/* Creative Features Section */}
            <section>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Creative Features for Even More Efficiency
                </h3>
                <p className="text-gray-600 text-sm">
                  Designed to save you hours of work in the long run.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">CREATE YOUR BEAUTIFUL MOMENT</h4>
                  <div className="bg-gray-100 rounded-lg aspect-[4/3] mb-4 flex items-center justify-center border border-gray-200">
                    <div className="text-gray-400 text-xs">Image</div>
                  </div>
                  {/* Editable labels */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">Jake</div>
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block ml-2">Robinhood</div>
                  </div>
                </div>
                <div className="flex gap-6 justify-center pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">100+</div>
                    <div className="text-xs text-gray-500 mt-1">Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">100+</div>
                    <div className="text-xs text-gray-500 mt-1">Assets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">10+</div>
                    <div className="text-xs text-gray-500 mt-1">Users</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Find Perfect Design Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-5 h-5 text-[#30AF56]" />
                <h3 className="text-2xl font-bold text-gray-900">Find your perfect design</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Look at the page and section designs that are created and pick the one.
              </p>
              
              <div className="mb-4">
                <Input
                  placeholder="Create a website for a travel agency with hero, blogs, testi..."
                  className="h-10 text-sm border-gray-300 mb-3"
                />
                <Button 
                  className="w-full bg-[#30AF56] hover:bg-[#2a9a4d] text-white rounded-lg"
                >
                  Generate
                </Button>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Choose one to insert</p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="border border-gray-200 rounded-lg aspect-[4/3] bg-gray-50 flex items-center justify-center">
                      <span className="text-xs text-gray-400">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Comments and History */}
            <section className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-base">Comments</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Use stickers for quick reactions, text or voice messages, if you've got lots to say.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-base">Restorable undo history</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Undo your edits even after reopening the app. Liner remembers everything.
                  </p>
                </div>
              </div>

              {/* Collaboration Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Team</span> and invite
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#30AF56] hover:text-[#2a9a4d] hover:bg-green-50"
                  >
                    Invite
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  Click on your id share with
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

