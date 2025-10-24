"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Shield, Zap, Users } from "lucide-react"

export default function About() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5 transition-all duration-300">
      <Header />

      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("about.title")}
          </h1>
          <p className="text-lg text-muted-foreground mb-12">{t("about.description")}</p>

          {/* Mission Section */}
          <div className="bg-card border border-border rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">{t("about.mission")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("about.missionText")}</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card border border-border rounded-xl p-6">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("about.securityFirst")}</h3>
              <p className="text-muted-foreground text-sm">{t("about.securityText")}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("about.fastReliable")}</h3>
              <p className="text-muted-foreground text-sm">{t("about.fastText")}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("about.expertSupport")}</h3>
              <p className="text-muted-foreground text-sm">{t("about.expertText")}</p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">{t("about.team")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("about.teamText")}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
