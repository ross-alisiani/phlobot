import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Phlobot",
  description: "Phlobot Privacy Policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <Link href="/" className="text-xl font-bold text-brand-700">
          🩺 Phlobot
        </Link>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Effective date: April 28, 2026</p>

        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Phlobot (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates a platform that connects life insurance advisors with independent mobile medical examiners. This Privacy Policy describes how we collect, use, and protect information you provide when you use our services, including our website at phlobot.com and our SMS notification program.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              When you register as a medical examiner or life insurance advisor, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Full name</li>
              <li>Email address</li>
              <li>Mobile phone number</li>
              <li>ZIP code and service area preferences</li>
              <li>Professional credentials (exam types, availability)</li>
              <li>Your explicit consent to receive SMS messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Send you SMS job notifications for exam opportunities near you</li>
              <li>Connect you with life insurance advisors when you claim a job</li>
              <li>Manage your account and preferences</li>
              <li>Improve our service and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. SMS Messaging Program</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              By providing your mobile phone number and checking the consent box on our sign-up form, you expressly agree to receive recurring automated SMS job notifications from Phlobot. These messages notify you of exam job opportunities available near your service area.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Message frequency:</strong> Varies based on job availability in your area</li>
              <li><strong>Message and data rates may apply</strong></li>
              <li>To opt out at any time, reply <strong>STOP</strong> to any Phlobot message</li>
              <li>To get help, reply <strong>HELP</strong> or email <a href="mailto:help@phlobot.com" className="text-brand-600 underline">help@phlobot.com</a></li>
              <li>Consent to receive SMS is not a condition of any purchase or service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Third-Party Service Providers</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We share your information with trusted third-party providers who help us operate our service:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Twilio</strong> — SMS delivery provider. Your phone number is transmitted to Twilio solely to deliver job notifications. Twilio&apos;s privacy policy is available at twilio.com/legal/privacy.</li>
              <li><strong>Supabase</strong> — Database and authentication provider. Your account data is stored securely in Supabase.</li>
              <li><strong>Resend</strong> — Transactional email delivery for connection emails and notifications.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              We do not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your account information for as long as your account is active or as needed to provide services. If you opt out of SMS messages via STOP, your phone number is flagged as inactive but retained to prevent accidental re-enrollment. You may request deletion of your data by contacting us at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures including encrypted data transmission (HTTPS), secure database access controls, and limited internal access to personal data. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Opt out of SMS messages at any time by replying <strong>STOP</strong></li>
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction or deletion of your personal information</li>
              <li>Withdraw consent to data processing</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              To exercise any of these rights, contact us at <a href="mailto:help@phlobot.com" className="text-brand-600 underline">help@phlobot.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this page. Continued use of our service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="mt-3 text-gray-600 space-y-1">
              <p><strong>Phlobot</strong></p>
              <p>Email: <a href="mailto:help@phlobot.com" className="text-brand-600 underline">help@phlobot.com</a></p>
              <p>Website: <a href="https://phlobot.com" className="text-brand-600 underline">phlobot.com</a></p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 mt-12">
        <div className="mx-auto max-w-3xl flex flex-wrap gap-4 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/privacy" className="text-gray-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms and Conditions</Link>
          <Link href="/examiner-signup" className="hover:text-gray-600">Sign Up as Examiner</Link>
        </div>
        <p className="mt-3 text-xs text-gray-400 mx-auto max-w-3xl">© 2026 Phlobot. All rights reserved.</p>
      </footer>
    </div>
  );
}
