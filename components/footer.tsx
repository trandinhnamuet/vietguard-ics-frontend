"use client"

import { useLanguage } from "./language-provider"
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 transition-all duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <a href="https://icss.com.vn" target="_blank" rel="noopener noreferrer">
              <h3 className="font-bold text-lg mb-4 text-white hover:text-primary transition-colors cursor-pointer">
                {t("footer.company")}
              </h3>
            </a>
            <div className="space-y-3 text-sm text-white/80">
              <p className="flex gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                <span>{t("footer.office")}</span>
              </p>
              <p className="flex gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                <span>{t("footer.phone")}</span>
              </p>
              <p className="flex gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                <span>{t("footer.hotline")}</span>
              </p>
              <p className="flex gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                <span>{t("footer.email")}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-primary">🌐</span>
                <span>{t("footer.website")}</span>
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">{t("footer.products")}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.oracle")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.vietguard")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.dashboard")}
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">{t("footer.connect")}</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>

          {/* VietGuardScan */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">VietGuardScan</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Nền tảng quét an ninh APK hàng đầu tại Việt Nam, cung cấp phân tích bảo mật toàn diện cho các ứng dụng
              Android.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <p className="text-center text-sm text-white/70">
            © 2025 VietGuardScan. All rights reserved. | Powered by ICSS
          </p>
        </div>
      </div>
    </footer>
  )
}
