export default function Donate() {
  return (
    <section id="donate" className="py-20 bg-gray-300">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-rust mb-8">Support Our Mission</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Sam's TNR, Inc. is a registered 501(c)(3) nonprofit organization. Your generous donations
          help us continue our mission of humanely managing community cat populations through
          Trap-Neuter-Return. Every dollar goes directly toward spay/neuter surgeries, vaccinations,
          and supplies.
        </p>
        <p className="text-gray-600 mb-8">All donations are tax-deductible to the extent allowed by law.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.zeffy.com/en-US/donation-form/lets-help-community-cats"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-rust hover:bg-rust/80 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Donate via Zeffy
          </a>
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=XQBBVZ62FLSQL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Donate via PayPal or Venmo
          </a>
        </div>
      </div>
    </section>
  )
}
