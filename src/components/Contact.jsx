export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-200">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-rust mb-8">Contact Us</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Have community cats that need TNR services? Want to volunteer or learn more about our
          work? We'd love to hear from you!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+12294645849"
            className="bg-rust text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-rust/80 transition-colors"
          >
            📞 Call
          </a>
          <a
            href="mailto:info@samstnr.org"
            className="bg-rust text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-rust/80 transition-colors"
          >
            ✉️ Email
          </a>
        </div>
      </div>
    </section>
  )
}
