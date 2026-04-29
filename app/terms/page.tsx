import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | Phlobot",
  description: "Phlobot Terms and Conditions — rules governing use of our service and SMS program.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
        <p className="text-sm text-gray-400 mb-10">Effective date: April 28, 2026</p>

        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Overview</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of Phlobot&apos;s platform and SMS notification program. By registering on our website at phlobot.com or opting in to receive SMS messages, you agree to these Terms. If you do not agree, do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed">
              Phlobot is a platform that connects life insurance advisors with independent mobile medical examiners. When an advisor submits an exam request, Phlobot notifies nearby registered examiners via SMS. Examiners can claim available jobs, coordinate with advisors, and complete medical exams for life insurance applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. SMS Messaging Program</h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Phlobot Examiner Alerts — Program Summary</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Program name:</strong> Phlobot Examiner Alerts</li>
                <li><strong>Description:</strong> Recurring automated SMS notifications for available medical exam jobs near your service area</li>
                <li><strong>Message frequency:</strong> Varies — messages are sent when exam jobs become available in your area. You may receive multiple messages per day during busy periods, or none during slow periods.</li>
                <li><strong>Message and data rates may apply</strong></li>
                <li>To opt out: Reply <strong>STOP</strong> to any message. You will receive a confirmation and no further messages will be sent.</li>
                <li>To get help: Reply <strong>HELP</strong> or email <a href="mailto:help@phlobot.com" className="text-brand-600 underline">help@phlobot.com</a></li>
                <li><strong>Supported carriers:</strong> Most US carriers. Carriers are not liable for delayed or undelivered messages.</li>
              </ul>
            </div>

            <p className="text-gray-600 leading-relaxed mb-3">
              By providing your mobile phone number and checking the consent checkbox on our examiner sign-up form at{" "}
              <a href="https://phlobot.com/examiner-signup" className="text-brand-600 underline">phlobot.com/examiner-signup</a>,
              you expressly consent to receive recurring automated SMS messages from Phlobot at the number provided. Consent is not a condition of any purchase or service.
            </p>

            <p className="text-gray-600 leading-relaxed">
              SMS messages are delivered through Twilio, our messaging service provider. Phlobot is solely responsible for the content of messages sent through its program.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Eligibility</h2>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 18 years of age and a resident of the United States to use Phlobot&apos;s services. By registering, you represent and warrant that you meet these requirements. You must provide a valid US mobile phone number capable of receiving SMS messages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. User Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed mb-3">By using Phlobot, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Provide accurate and truthful registration information</li>
              <li>Maintain a valid US mobile phone number on your account</li>
              <li>Conduct yourself professionally when coordinating with advisors and clients</li>
              <li>Not share your account credentials with others</li>
              <li>Notify us promptly if your contact information changes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Job Claims and Commitments</h2>
            <p className="text-gray-600 leading-relaxed">
              When you reply YES to a job offer SMS, you are committing to complete that medical examination. Phlobot will connect you with the requesting advisor via email. Repeated no-shows or failures to complete claimed jobs may result in suspension or removal from the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content, branding, and software on phlobot.com is owned by Phlobot and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              Phlobot is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. We do not guarantee continuous availability, error-free operation, or any specific volume of job opportunities. SMS delivery is subject to mobile carrier availability and network conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, Phlobot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to lost earnings, missed job opportunities, or SMS delivery failures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Modifications to Service and Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              Phlobot reserves the right to modify these Terms or discontinue the service at any time. Material changes will be communicated via email or SMS where practicable. Continued use of the service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by the laws of the United States and the state of Colorado, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about these Terms, please contact us:
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
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-600">Terms and Conditions</Link>
          <Link href="/examiner-signup" className="hover:text-gray-600">Sign Up as Examiner</Link>
        </div>
        <p className="mt-3 text-xs text-gray-400 mx-auto max-w-3xl">© 2026 Phlobot. All rights reserved.</p>
      </footer>
    </div>
  );
}
