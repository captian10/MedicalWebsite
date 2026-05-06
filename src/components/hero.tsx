"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Award, Users, BookOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { icon: Users, value: "10,000+", label: "Anesthesia Cases Managed" },
  { icon: Award, value: "15+", label: "Years in Anesthesiology" },
  { icon: BookOpen, value: "200+", label: "Lectures & Materials" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />

      <div className="relative container mx-auto px-4 py-20 lg:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span>Anesthesiology Education & Updates</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              Safer Anesthesia, <br />
              <span className="text-black">Better Outcomes</span>
            </h1>

            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              Dedicated anesthesiology lectures and clinical resources for airway
              management, regional anesthesia, ICU care, pain management, and
              patient safety — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="xl"
                className="bg-white text-medical-700 hover:bg-white/90 shadow-xl"
                asChild
              >
                <Link href="/lectures">Browse Anesthesia Lectures</Link>
              </Button>

              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-medical-700 hover:bg-white/10"
                asChild
              >
                <Link href="/announcements">
                  <Play className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <stat.icon className="h-5 w-5 text-teal-300" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div> */}

            {/* Quick tags (optional but looks premium) */}
            {/* <div className="flex flex-wrap gap-2 pt-2">
              {[
                "Airway Management",
                "Regional Anesthesia",
                "ICU & Critical Care",
                "Pain Medicine",
                "Patient Safety",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div> */}
          </div>

          {/* ✅ Doctor Card */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-sm overflow-hidden border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-md">
              {/* ✅ Doctor Image on Top (1:1 Square) */}
              <div className="relative w-full aspect-square">
                <Image
                  src="/images/DrSaadMahdy.png"
                  alt="Dr. Saad Mahdy"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />

                {/* ✅ Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/50" />

                {/* ✅ Ribbon */}
                <div className="absolute right-0 top-0 h-20 w-20 overflow-hidden pointer-events-none">
                  <div className="absolute right-[-28px] top-[22px] h-3 w-32 rotate-45 bg-black/80 rounded-sm shadow-md" />
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  {/* optional badge line */}
                </div>
              </div>

              {/* ✅ Text Content */}
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold leading-tight">
                    Dr. Saad Mahdy
                  </h3>
                  <p className="text-sm text-teal-200">
                    Anesthesiology & Critical Care
                  </p>
                  <p className="text-xs text-white/60 mt-1 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-teal-300" />
                    Patient Safety • Airway • ICU
                  </p>
                </div>

                <p
                  className="text-sm text-white/80 leading-relaxed text-center font-bold"
                  dir="rtl"
                >
                  هذا الموقع صدقة جارية على روح الدكتور سعد مهدي رحمة الله عليه.
                  لا تنسوه من صالح دعائكم 
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
