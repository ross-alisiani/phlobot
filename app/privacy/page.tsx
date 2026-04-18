export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 17, 2026</p>

      <p className="mb-6">
        Phlowbot LLC ("we," "us," or "our") operates the Phlobot platform
        (phlobot.vercel.app). This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you use our
        platform. Please read it carefully.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
        <p className="mb-3">We collect information you provide directly when you:</p>
        <ul className="list-disc pl-6 space-y-2 mb-3">
          <li>Register as an advisor or examiner (name, email address, phone number, license information, and location/ZIP code)</li>
          <li>Submit or claim an exam request (client details needed to coordinate the exam)</li>
          <li>Contact us for support</li>
        </ul>
        <p>
          We also automatically collect certain technical information when you
          use the platform, such as your IP address, browser type, device
          identifiers, and pages visited, primarily for security and analytics
          purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
        <p className="mb-3">We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Create and manage your account</li>
          <li>Match advisors with available medical examiners</li>
          <li>Send SMS notifications about exam job availability, status updates, and appointment confirmations</li>
          <li>Communicate with you about your account or the platform</li>
          <li>Improve and maintain the platform</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. SMS Messaging</h2>
        <p className="mb-3">
          With your explicit consent provided at sign-up, we send automated
          SMS messages to examiners regarding available exam jobs and related
          updates. Message frequency varies based on job activity. Standard
          message and data rates may apply.
        </p>
        <p>
          You may opt out of SMS messages at any time by replying{" "}
          <strong>STOP</strong> to any message. Reply <strong>HELP</strong>{" "}
          for support information. Opting out will stop all platform SMS
          notifications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. How We Share Your Information</h2>
        <p className="mb-3">
          We do not sell your personal information. We may share information
          in the following limited circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Between advisors and examiners:</strong> When an exam job
            is claimed, we share the necessary contact and job details between
            the relevant advisor and examiner to coordinate the appointment.
          </li>
          <li>
            <strong>Service providers:</strong> We use third-party services
            (including Twilio for SMS, Supabase for database hosting, and
            Vercel for application hosting) that process data on our behalf
            under confidentiality obligations.
          </li>
          <li>
            <strong>Legal requirements:</strong> We may disclose information
            if required by law or to protect the rights and safety of our
            users or the public.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
        <p>
          We retain your account information for as long as your account is
          active or as needed to provide services. You may request deletion
          of your account and associated data by contacting us at
          support@phlobot.com. We will fulfill requests within 30 days,
          except where retention is required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your
          information, including encrypted data transmission (HTTPS) and
          secure database access controls. However, no method of transmission
          over the internet is 100% secure, and we cannot guarantee absolute
          security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
        <p className="mb-3">You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your account and data</li>
          <li>Opt out of SMS communications at any time by replying STOP</li>
        </ul>
        <p className="mt-3">
          To exercise these rights, contact us at support@phlobot.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
        <p>
          Phlobot is not intended for use by anyone under the age of 18. We
          do not knowingly collect personal information from minors. If you
          believe a minor has provided us with personal information, please
          contact us and we will delete it promptly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will update the "Last updated" date at the top of this page and
          notify registered users via email for material changes. Continued
          use of the platform after changes take effect constitutes acceptance
          of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy, please
          contact us at:
        </p>
        <address className="not-italic mt-2 text-gray-700">
          Phlowbot LLC<br />
          Denver, CO<br />
          <a href="mailto:support@phlobot.com" className="text-blue-600 underline">
            support@phlobot.com
          </a>
        </address>
      </section>
    </main>
  );
}
