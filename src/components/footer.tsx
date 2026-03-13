import Link from "next/link";
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Lectures", href: "/lectures" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

type SocialLink = {
  name: string;
  href?: string; // optional => if missing, we disable the button
  icon: React.ElementType;
};

const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Instagram", href: "#", icon: Instagram },
];

const CONTACT = {
  addressLines: ["123 Medical Center Drive", "Healthcare City, HC 12345"],
  phone: "+1 (234) 567-890",
  email: "contact@drmedical.com",
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-300">
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-medical text-white shadow-sm">
                <Stethoscope className="h-5 w-5" />
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
          <div>
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
            <Link
              href="/privacy"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
