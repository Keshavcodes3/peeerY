import { Button } from "../../../components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"

export function FinalCTA() {
  const { isSignedIn } = useAuth()
  const ctaTo = isSignedIn ? "/dashboard" : "/register"

  return (
    <section className="py-32 px-6 border-t border-zinc-900 text-center max-w-4xl mx-auto space-y-8">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
        Build together. Ship together.
      </h2>
      <p className="text-lg text-zinc-400 max-w-md mx-auto">
        Stop building alone. Find developers who share your stack, your timezone, and your drive.
      </p>
      <div className="pt-4">
        <Link to={ctaTo}>
          <Button size="lg" className="rounded-full text-base font-semibold px-8 h-12 bg-white text-black hover:bg-zinc-200 shadow-lg cursor-pointer">
            {isSignedIn ? 'Go to Dashboard' : 'Start Building Now'}
          </Button>
        </Link>
      </div>
    </section>
  )
}
