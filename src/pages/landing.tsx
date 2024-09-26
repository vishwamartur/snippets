import Header from "@/components/Header"
import { LandingHero } from "@/components/LandingHero"

export const LandingPage = () => (
  <div>
    <Header />
    <div className="container mx-auto max-w-4xl px-4">
      <LandingHero />
    </div>
  </div>
)
