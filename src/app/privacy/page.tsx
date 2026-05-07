import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20 max-w-4xl min-h-screen">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-medical-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-lg text-medical-800/80 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">1. Information We Collect</h2>
            <p>
              When you register for Mega Medical Academy, we collect personal information necessary to provide our educational services. This includes your name, email address, professional title (e.g., Anesthesiologist, Resident), and login credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our educational platform.</li>
              <li>Improve, personalize, and expand our website content.</li>
              <li>Communicate with you regarding new lectures, announcements, and updates.</li>
              <li>Ensure the security and integrity of our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. Your account credentials and data are securely stored using Supabase authentication and database services. We do not sell, trade, or rent your personal identification information to others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">4. Cookies and Tracking</h2>
            <p>
              We use necessary cookies to maintain your login session and save your preferences. We may also use analytics tools to understand how doctors interact with our lectures so we can improve the user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us via our official WhatsApp channel or email.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}