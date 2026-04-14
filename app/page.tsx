import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-xl font-bold text-brand-700">🩺 Phlobot</span>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary text-sm py-2 px-4">
            Log In
          </Link>
          <Link href="/signup" className="btn-primary text-sm py-2 px-4">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-brand-50 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Mobile Paramedical Exam Scheduling
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Stop calling exam companies<br />
          <span className="text-brand-600">and get back to helping clients!</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Phlobot connects insurance advisors with mobile examiners in seconds —
          no phone tag, no spreadsheets, no chaos.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup" className="btn-primary text-base py-3 px-8">
            Start Free →
          </Link>
          <Link href="/examiner-signup" className="btn-secondary text-base py-3 px-8">
            I'm an Examiner
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📋",
                step: "1",
                title: "Submit a request",
                body: "Enter the patient's age, gender, ZIP code, exam type, and your preferred scheduling window.",
              },
              {
                icon: "📱",
                step: "2",
                title: "Examiners get texted",
                body: "Phlobot instantly texts nearby qualified examiners. The first one to reply YES claims the job.",
              },
              {
                icon: "✅",
                step: "3",
                title: "You're connected",
                body: "Both you and the examiner get an email with details. Exchange patient info directly — Phlobot steps aside.",
              },
            ].map((item) => (
              <div key={item.step} className="card text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-xs font-bold text-brand-500 uppercase tracking-wide mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to try it?</h2>
          <p className="text-gray-500 mb-8">
            Start free. No credit card required.
          </p>
          <Link href="/signup" className="btn-primary text-base py-3 px-8">
            Create your free account
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Phlobot. All rights reserved.
      </footer>
    </main>
  );
}
