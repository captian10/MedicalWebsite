import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ✅ Custom SVG for the official WhatsApp Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Lectures", href: "/lectures" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "https://wa.me/447418343611" },
];

type SocialLink = {
  name: string;
  href?: string;
  icon: React.ElementType;
};

const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "#", icon: Facebook },
  // ✅ Now using the official WhatsApp icon
  { name: "WhatsApp", href: "https://wa.me/447418343611", icon: WhatsAppIcon },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Instagram", href: "#", icon: Instagram },
];

const CONTACT = {
  addressLines: ["123 Medical Center Drive", "Healthcare City, HC 12345"],
  phone: "+447418343611",
  email: "megaonlineanesthesia@gmail.com",
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-300">
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div id="about" className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="Mega Medical Academy Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">Mega Medical Academy</span>
            </Link>

            <p className="text-sm leading-relaxed text-zinc-400">
              Dedicated to providing exceptional healthcare services and medical
              education. Your health is our priority.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const disabled = !social.href || social.href === "#";

                const base =
                  "flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-all";
                const hover =
                  "hover:bg-medical-600 hover:text-white hover:shadow-md";
                const focus =
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
                const disabledCls =
                  "opacity-40 cursor-not-allowed hover:bg-white/5 hover:text-zinc-400 hover:shadow-none";

                return disabled ? (
                  <span
                    key={social.name}
                    aria-label={social.name}
                    title={`${social.name} (coming soon)`}
                    className={cn(base, disabledCls)}
                  >
                    <social.icon className="h-4 w-4" />
                  </span>
                ) : (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={cn(base, hover, focus)}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-medical-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Contact Us
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-medical-400" />
                <span className="text-sm text-zinc-400 leading-relaxed">
                  {CONTACT.addressLines[0]}
                  <br />
                  {CONTACT.addressLines[1]}
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-medical-400" />
                <a
                  href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`}
                  className="text-sm text-zinc-400 transition-colors hover:text-medical-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
                >
                  {CONTACT.phone}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-medical-400" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-zinc-400 transition-colors hover:text-medical-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Working Hours
            </h3>

            <ul className="space-y-2 text-sm">
              <li className="flex justify-between gap-6">
                <span className="text-zinc-400">Monday - Friday</span>
                <span className="text-white">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between gap-6">
                <span className="text-zinc-400">Saturday</span>
                <span className="text-white">9:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between gap-6">
                <span className="text-zinc-400">Sunday</span>
                <span className="text-zinc-500">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            &copy; {year} Mega Medical Academy. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-medical-600 dark:hover:text-medical-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-medical-600 dark:hover:text-medical-400 transition-colors">
              Terms of Service
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}