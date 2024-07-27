"use client";
import Navbar from "@/components/Navbar";
import Hero from '@/components/Hero';
import SignEvent from '@/components/SignEvent';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <Hero />
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <SignEvent />
        </div>
      </main>
    </div>
  )
}