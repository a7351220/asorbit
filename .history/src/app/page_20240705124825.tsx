import Navbar from "@/components/Navbar";
import Hero from '@/components/Hero';
import SignEvent from '../components/SignEvent';


export default function Home() {
  return (
    <main className="min-h-screen bg-blue-900">
      <Navbar />
      <Hero />
      <SignEvent />
    </main>
  )
}