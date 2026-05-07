import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20 max-w-4xl min-h-screen">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-medical-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-lg text-medical-800/80 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">1. Medical Disclaimer (Important)</h2>
            <p className="p-4 bg-medical-50 dark:bg-medical-900/20 border-l-4 border-medical-600 rounded-r-lg">
              <strong>Educational Purposes Only:</strong> Mega Medical Academy is an educational platform designed for licensed medical professionals, residents, and medical students. The content, lectures, and materials provided are for informational and educational purposes only. They do <strong>not</strong> constitute direct medical advice, diagnosis, or treatment for patients. Always rely on your own clinical judgment and local institutional protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">2. Acceptance of Terms</h2>
            <p>
              By accessing and using Mega Medical Academy, you agree to be bound by these Terms of Service. This platform operates as an ongoing charity (Sadaqah Jariyah) in memory of Dr. Saad Mahdy, aimed at elevating the practice of anesthesiology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">3. Intellectual Property</h2>
            <p>
              All video lectures, PDF presentations, text, and graphics on this platform are the property of Mega Medical Academy or their respective contributing lecturers. You may download provided resources for personal educational use, but you may not re-upload, sell, or commercially distribute these materials without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">4. User Accounts</h2>
            <p>
              To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these terms or behave unprofessionally.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-medical-900 dark:text-white mb-3">5. Modifications to the Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the service at any time. We may also update these Terms from time to time, and your continued use of the platform constitutes acceptance of those changes.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}