"use client";

import { useState } from "react";
import { Mail, ArrowRight, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Successfully subscribed! ✓",
      description: "You'll receive notifications about new anesthesia lectures and updates.",
    });

    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-medical-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white/0.03)_1px,transparent_0)] [background-size:32px_32px]" />

      {/* Decorative blurs */}
      <div className="absolute -top-20 right-1/3 h-60 w-60 rounded-full bg-medical-600/10 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-medical-500/10 blur-3xl" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-medical-600/20 ring-1 ring-medical-500/30">
              <Bell className="h-5 w-5 text-medical-400" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated on New Lectures
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Get notified when new anesthesiology lectures, ICU resources, and
            clinical updates are published.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500/50 transition-all duration-200"
                required
                disabled={isSubmitting}
                id="newsletter-email"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-medical-600 hover:bg-medical-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 shrink-0"
              id="newsletter-subscribe-btn"
            >
              {isSubmitting ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-spin" />
                  Subscribing…
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-zinc-600 mt-4">
            No spam. Unsubscribe anytime. Your privacy matters to us.
          </p>
        </div>
      </div>
    </section>
  );
}
