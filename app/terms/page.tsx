export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 17, 2026</p>

      <p className="mb-6">
        Please read these Terms and Conditions carefully before using Phlobot
        (the Platform), operated by Phlowbot LLC (we, us, or our). By accessing
        or using Phlobot, you agree to be bound by these Terms.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Description of Service</h2>
        <p>
          Phlobot is an online platform that connects independent life insurance
          advisors with licensed mobile medical examiners. Advisors submit exam
          requests; examiners receive SMS notifications and may claim available
          jobs through the Platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
        <p>
          To use Phlobot you must be at least 18 years old and, where applicable,
          hold any professional licenses required to perform your role. By
          registering you represent that all information you provide is accurate.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. SMS Notifications and Messaging</h2>
        <p className="mb-3">
          By completing the examiner sign-up form you expressly consent to receive
          recurring automated SMS text messages from Phlobot at the mobile number
          you provide. These messages may include new exam job alerts, job status
          updates, appointment confirmations, and platform notices.
        </p>
        <p className="mb-3">
          Message frequency varies based on job availability. Standard message and
          data rates may apply. To opt out at any time, reply STOP to any message.
          To request help, reply HELP or contact us at support@phlobot.com.
        </p>
        <p>
          Opting out will stop all job-related SMS notifications. You may still
          access the Platform through your account portal.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activity that occurs under your account. Notify
          us immediately at support@phlobot.com if you suspect unauthorized use.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
        <p className="mb-3">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide false or misleading information during registration or job fulfillment.</li>
          <li>Use the Platform for any unlawful purpose or in violation of applicable regulations.</li>
          <li>Interfere with or disrupt the integrity or performance of the Platform.</li>
          <li>Attempt to gain unauthorized access to any part of the Platform.</li>
          <li>Resell or sublicense access to the Platform without our prior written consent.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Independent Contractors</h2>
        <p>
          Examiners who use Phlobot are independent contractors and not employees,
          agents, or partners of Phlowbot LLC or of any advisor using the Platform.
          Phlobot does not guarantee the availability of jobs or the suitability of
          any examiner for a particular engagement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Privacy</h2>
        <p>
          Your use of the Platform is also governed by our Privacy Policy,
          which is incorporated into these Terms by reference.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
        <p>
          All content, trademarks, logos, and software associated with Phlobot are
          the property of Phlowbot LLC or its licensors. You may not copy,
          reproduce, or distribute any part of the Platform without our express
          written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Disclaimer of Warranties</h2>
        <p>
          The Platform is provided as-is and as-available without warranties of any
          kind, express or implied. We do not warrant that the Platform will be
          uninterrupted, error-free, or free of harmful components.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Phlowbot LLC shall not be liable
          for any indirect, incidental, special, consequential, or punitive damages
          arising out of or related to your use of the Platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">11. Modifications</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify
          registered users of material changes via email or an in-platform notice.
          Continued use of the Platform after changes take effect constitutes
          acceptance of the revised Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Colorado, without
          regard to its conflict of law provisions. Any disputes shall be resolved
          in the state or federal courts located in Denver, Colorado.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
        <p>If you have questions about these Terms, please contact us at:</p>
        <address className="not-italic mt-2 text-gray-700">
          Phlowbot LLC<br />
          Denver, CO<br />
          support@phlobot.com
        </address>
      </section>
    </main>
  );
}
