import Navbar from "@/components/Navbar";
import SignEvent from "@/components/SignEvent";
import Hero from '@/components/Hero'



export default function Home() {
  return (
    <main className="min-h-screen bg-blue-900">
      <Navbar />
      <Hero />
      <SignEvent />
    </main>
  )
}