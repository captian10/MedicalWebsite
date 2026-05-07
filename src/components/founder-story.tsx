import Image from "next/image";
import { Heart, BookOpen, Stethoscope, Award } from "lucide-react";

const highlights = [
  {
    icon: Stethoscope,
    title: "Anesthesiology",
    description: "Expert lectures on airway management, regional anesthesia, and patient safety",
  },
  {
    icon: BookOpen,
    title: "ICU & Critical Care",
    description: "In-depth clinical resources for intensive care and perioperative medicine",
  },
  {
    icon: Award,
    title: "Pain Management",
    description: "Evidence-based approaches to acute and chronic pain treatment",
  },
];

export function FounderStory() {
  return (
    <section className="relative py-24 overflow-hidden" id="founder-story">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-medical-50/40 via-white to-medical-100/30 dark:from-medical-950/20 dark:via-background dark:to-medical-950/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.medical.200/0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,theme(colors.medical.900/0.1)_1px,transparent_0)] [background-size:24px_24px]" />

      {/* Decorative blurs */}
      <div className="absolute -top-32 right-1/4 h-64 w-64 rounded-full bg-medical-200/20 dark:bg-medical-800/10 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-medical-100/30 dark:bg-medical-900/10 blur-3xl" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-medical-100 dark:bg-medical-900/40">
              <Heart className="h-4 w-4 text-medical-600 dark:text-medical-400" />
            </div>
            <span className="text-sm font-semibold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
              Sadaqah Jariyah — صدقة جارية
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Story of Dr. Saad Mahdy
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A legacy of knowledge, dedication, and unwavering commitment to saving lives
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Image side */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative group">
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-medical-200/40 via-medical-100/20 to-medical-300/30 dark:from-medical-800/20 dark:via-medical-900/10 dark:to-medical-800/15 blur-sm transition-all duration-500 group-hover:blur-md" />

              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80 dark:border-medical-900/40">
                <Image
                  src="/images/DrSaadMahdy.png"
                  alt="Dr. Saad Mahdy — Anesthesiology & Critical Care"
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-lg">Dr. Saad Mahdy</p>
                  <p className="text-white/80 text-sm">رحمه الله</p>
                </div>
              </div>

              {/* Memorial ribbon */}
              <div className="absolute -top-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-medical-600 shadow-lg">
                <Heart className="h-5 w-5 text-white" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Story side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Arabic dedication */}
            <div className="bg-medical-50/60 dark:bg-medical-950/30 border border-medical-200/50 dark:border-medical-800/30 rounded-2xl p-6 backdrop-blur-sm">
              <p
                className="text-lg md:text-xl text-medical-800 dark:text-medical-200 leading-relaxed text-center font-semibold"
                dir="rtl"
              >
                هذا الموقع صدقة جارية على روح الدكتور سعد مهدي رحمة الله عليه.
                <br />
                لا تنسوه من صالح دعائكم 🤲
              </p>
            </div>

            {/* English story */}
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong className="text-foreground">Mega Medical Academy</strong> was established as a{" "}
                <em className="text-medical-600 dark:text-medical-400 font-medium not-italic">
                  Sadaqah Jariyah
                </em>{" "}
                (ongoing charity) in honor of{" "}
                <strong className="text-foreground">Dr. Saad Mahdy</strong> — a
                distinguished physician who devoted his career to
                Anesthesiology, ICU, and Pain Management.
              </p>
              <p>
                His passion for teaching and mentoring fellow doctors inspired
                the creation of this platform, where his medical knowledge can
                continue to benefit healthcare professionals around the world.
                Every lecture watched, every resource downloaded, is a tribute
                to his enduring legacy.
              </p>
              <p className="text-muted-foreground text-sm italic">
                May his knowledge serve as an eternal reward, and may Allah grant him
                the highest levels of Jannah. Ameen.
              </p>
            </div>

            {/* Knowledge areas */}
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="group/card rounded-xl border border-border/60 bg-card/50 dark:bg-card/30 p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-medical-200 dark:hover:border-medical-800/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-medical-100 dark:bg-medical-900/40 mb-3 transition-colors duration-300 group-hover/card:bg-medical-200 dark:group-hover/card:bg-medical-900/60">
                    <item.icon className="h-5 w-5 text-medical-600 dark:text-medical-400" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
