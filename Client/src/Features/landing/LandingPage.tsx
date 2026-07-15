import { Navbar } from "./Components/Navbar"
import { HeroSection } from "./Components/HeroSection"
import { ProblemSection } from "./Components/ProblemSection"
import EcosystemSection from "./Components/EcosystemSection"
import { Footer } from "./Components/Footer"
import { Helmet } from "react-helmet-async"
import { JsonLd } from "../../components/seo/JsonLd"

export default function LandingPage() {
  return (
    <article className="min-h-screen bg-white text-zinc-900 selection:bg-blue-500/20 grid-bg relative">
      <Helmet>
        <title>PeerY - The Collaborative Hub for Modern Developers</title>
        <meta name="description" content="Join PeerY to collaborate with top-tier developers, build real-world projects, and showcase your professional journey. Elevate your development career today." />
        <link rel="canonical" href="https://peery.io/" />
      </Helmet>
      <JsonLd data={{
        "@type": "WebApplication",
        "name": "PeerY",
        "url": "https://peery.io/",
        "description": "The collaborative hub for modern developers to build projects and grow together.",
        "applicationCategory": "DeveloperTool"
      }} />
      <header>
        <Navbar />
      </header>
      <main className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <EcosystemSection />
      </main>
      <Footer />
    </article>
  )
}

