"use client"

import React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useLanguage } from "./language-provider"
import { Moon, Sun, Globe } from "lucide-react"
import Image from "next/image"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-sm supports-[backdrop-filter]:bg-white/10 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-10 h-10">
              <Image
                src="https://icss.com.vn/wp-content/uploads/2025/08/Thiet-ke-chua-co-ten-23-1024x1024.png"
                alt="VietGuardScan Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-white drop-shadow-lg">
              VietGuardScan
            </span>
          </Link>

          {/* Navigation - Increased font size and aligned to right */}
          <nav className="hidden md:flex items-center gap-12 ml-auto mr-8">
            <Link href="/" className="text-base font-medium text-white hover:text-primary transition-colors duration-200 drop-shadow">
              {t("header.home")}
            </Link>
            <Link href="/members" className="text-base font-medium text-white hover:text-primary transition-colors duration-200 drop-shadow">
              Members
            </Link>
            <Link href="/contact" className="text-base font-medium text-white hover:text-primary transition-colors duration-200 drop-shadow">
              {t("header.contact")}
            </Link>
            <Link href="/about" className="text-base font-medium text-white hover:text-primary transition-colors duration-200 drop-shadow">
              {t("header.about")}
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/20 transition-colors duration-200">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as "vi" | "en" | "zh")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/20 transition-colors flex items-center gap-2 ${
                      language === lang.code ? "bg-primary/20 text-primary font-semibold" : "text-gray-700"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            {/* <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button> */}
          </div>
        </div>
      </div>
    </header>
  )
}
