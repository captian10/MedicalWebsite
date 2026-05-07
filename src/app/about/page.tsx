import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  BookOpen,
  Stethoscope,
  Award,
  ArrowLeft,
  Quote,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About the Founder | Dr. Saad Mahdy — Mega Medical Academy",
  description:
    "Mega Medical Academy is a Sadaqah Jariyah (ongoing charity) in memory of Dr. Saad Mahdy, sharing his expertise in Anesthesiology, ICU, and Pain Management.",
};

const highlights = [
  {
    icon: Stethoscope,
    title: "Anesthesiology",
    description:
      "Expert lectures on airway management, regional anesthesia, patient safety, and perioperative medicine.",
  },
  {
    icon: BookOpen,
    title: "ICU & Critical Care",
    description:
      "In-depth clinical resources for intensive care, ventilator management, and hemodynamic monitoring.",
  },
  {
    icon: Award,
    title: "Pain Management",
    description:
      "Evidence-based approaches to acute and chronic pain treatment for better patient outcomes.",
  },
];

// const milestones = [
//   {
//     label: "Years of Clinical Excellence",
//     value: "15+",
//   },
//   {
//     label: "Lectures & Educational Materials",
//     value: "200+",
//   },
//   {
//     label: "Doctors Mentored",
//     value: "500+",
//   },
// ];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero banner */}
        <section className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-medical-800 via-medical-700 to-medical-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white/0.04)_1px,transparent_0)] [background-size:24px_24px]" />

          {/* Decorative blurs */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-medical-400/10 blur-3xl" />

          <div className="relative container mx-auto px-4 py-20 lg:py-28 lg:px-8">
            <div className="max-w-3xl">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 mb-6"
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/80 mb-6">
                <Heart className="h-4 w-4 text-medical-200" fill="currentColor" />
                <span>Sadaqah Jariyah — صدقة جارية</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                In Memory of{" "}
                <span className="text-medical-200">Dr. Saad Mahdy</span>
              </h1>

              <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
                A distinguished physician whose devotion to Anesthesiology, ICU,
                and Pain Management continues to inspire and educate healthcare
                professionals around the world.
              </p>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <path
                d="M0 80L60 72C120 64 240 48 360 42C480 36 600 40 720 44C840 48 960 52 1080 54C1200 56 1320 56 1380 56L1440 56V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
                className="fill-background"
              />
            </svg>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-16 items-start">
              {/* Image column */}
              <div className="lg:col-span-2">
                <div className="sticky top-28">
                  {/* Doctor image */}
                  <div className="relative group">
                    {/* Decorative ring */}
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-medical-200/30 via-medical-100/15 to-medical-300/20 dark:from-medical-800/15 dark:via-medical-900/5 dark:to-medical-800/10 blur-md transition-all duration-500 group-hover:blur-lg" />

                    <div className="relative w-full aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80 dark:border-medical-900/40">
                      <Image
                        src="/images/DrSaadMahdy.png"
                        alt="Dr. Saad Mahdy — Anesthesiology & Critical Care Specialist"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-white font-bold text-xl mb-1">
                          Dr. Saad Mahdy
                        </p>
                        <p className="text-white/80 text-sm">
                          Anesthesiology & Critical Care
                        </p>
                        {/* <p className="text-white/60 text-sm mt-1" dir="rtl">
                          رحمه الله
                        </p> */}
                      </div>
                    </div>

                    {/* Memorial badge */}
                    <div className="absolute -top-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-medical-600 shadow-lg ring-4 ring-background">
                      <Heart
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {/* {milestones.map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center rounded-xl border border-border/60 bg-card/50 dark:bg-card/30 p-4"
                      >
                        <p className="text-2xl font-bold text-medical-600 dark:text-medical-400">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-tight">
                          {stat.label}
                        </p>
                      </div>
                    ))} */}
                  </div>
                </div>
              </div>

              {/* Story column */}
              <div className="lg:col-span-3 space-y-10">
                {/* Arabic dedication card */}
                <div className="bg-medical-50/60 dark:bg-medical-950/30 border border-medical-200/50 dark:border-medical-800/30 rounded-2xl p-8 backdrop-blur-sm">
                  <Quote className="h-8 w-8 text-medical-300 dark:text-medical-700 mb-4" />
                  <p
                    className="text-xl md:text-2xl text-medical-800 dark:text-medical-200 leading-relaxed text-center font-semibold"
                    dir="rtl"
                  >
                    هذا الموقع صدقة جارية على روح الدكتور سعد مهدي رحمة الله عليه.
                    <br />
                    لا تنسوه من صالح دعائكم 
                  </p>
                </div>

                {/* Story */}
                <div className="space-y-6 text-foreground/85 leading-relaxed text-lg">
                  <h2 className="text-2xl font-bold text-foreground">
                    A Legacy of Knowledge & Compassion
                  </h2>

                  <p>
                    <strong className="text-foreground">
                      Mega Medical Academy
                    </strong>{" "}
                    was established as a{" "}
                    <em className="text-medical-600 dark:text-medical-400 font-medium not-italic">
                      Sadaqah Jariyah
                    </em>{" "}
                    (ongoing charity) in honor and memory of{" "}
                    <strong className="text-foreground">Dr. Saad Mahdy</strong>{" "}
                    — a distinguished physician who devoted his career to the
                    fields of Anesthesiology, ICU, and Pain Management.
                  </p>

                  <p>
                    Throughout his career, Dr. Saad Mahdy was known not just for
                    his clinical excellence, but for his unwavering dedication to
                    teaching and mentoring the next generation of
                    anesthesiologists. He believed that sharing medical knowledge
                    was not just a professional duty, but a moral responsibility
                    — and that every patient who benefits from a well-trained
                    doctor is a testament to the chain of knowledge that makes
                    medicine a noble profession.
                  </p>

                  <p>
                    His passion for education inspired the creation of this
                    platform, where his medical knowledge and the knowledge of
                    contributors can continue to benefit healthcare professionals
                    around the world. Every lecture watched, every resource
                    downloaded, and every skill refined through this academy is a
                    tribute to his enduring legacy.
                  </p>
                </div>

                {/* Mission */}
                <div className="border-l-4 border-medical-500 pl-6 py-2">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Our Mission
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    To provide free, high-quality anesthesiology education and
                    clinical resources that empower healthcare professionals
                    worldwide — ensuring that Dr. Saad Mahdy&apos;s dedication to
                    teaching continues to save lives and improve patient outcomes
                    for generations to come.
                  </p>
                </div>

                {/* Closing prayer */}
                <div className="bg-muted/50 dark:bg-muted/20 rounded-2xl p-6 text-center">
                  <p className="text-muted-foreground italic">
                    May his knowledge serve as an eternal reward, and may Allah
                    grant him the highest levels of Jannah. Ameen.
                  </p>
                </div>

                {/* Knowledge areas */}
                <div>
                  <h3 className="text-xl font-bold mb-6">
                    Areas of Knowledge
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {highlights.map((item) => (
                      <div
                        key={item.title}
                        className="group/card rounded-xl border border-border/60 bg-card/50 dark:bg-card/30 p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-medical-200 dark:hover:border-medical-800/50"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-medical-100 dark:bg-medical-900/40 mb-3 transition-colors duration-300 group-hover/card:bg-medical-200 dark:group-hover/card:bg-medical-900/60">
                          <item.icon className="h-5 w-5 text-medical-600 dark:text-medical-400" />
                        </div>
                        <h4 className="font-semibold text-sm mb-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button variant="medical" size="lg" asChild>
                    <Link href="/lectures">Browse Lectures</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
