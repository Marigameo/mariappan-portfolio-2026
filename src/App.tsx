import { ProfileCard } from "./components/profile-card"
import { InstagramCard } from "./components/instagram-card"
import { AboutSection } from "./components/sections/about-section"
import { ExperienceSection } from "./components/sections/experience-section"
import { ProjectsSection } from "./components/sections/projects-section"
import { TalksSection } from "./components/sections/talks-section"
import { ArticlesSection } from "./components/sections/articles-section"
import { Navbar } from "./components/navbar"
import { SEO } from "./components/seo"

function App() {
  return (
    <>
      <SEO />
      <Navbar />

      <div className="min-h-screen bg-background">
        {/* Main Container with padding for navbar */}
        <div className="container mx-auto px-6 pt-12 pb-32 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column - Profile Card and Instagram Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <ProfileCard />
                {/* Instagram Card - Desktop only */}
                <div className="hidden lg:block">
                  <InstagramCard />
                </div>
              </div>
            </div>

            {/* Right Column - Scrollable Content */}
            <div className="lg:col-span-8 lg:pl-2 space-y-16">
              <AboutSection />
              <ExperienceSection />
              <ProjectsSection />
              <TalksSection />
              <ArticlesSection />

              {/* Instagram Card - Mobile only */}
              <div className="block lg:hidden">
                <InstagramCard />
              </div>

              {/* Footer */}
              <footer className="pt-16 pb-8 text-center text-sm text-muted-foreground">
                <p>Crafted with care (and caffeine) in India 🇮🇳</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
