const cards = [
  {
    icon: '🐾',
    title: 'Population Control',
    desc: 'TNR is the most humane and effective method for managing community cat populations. By spaying and neutering, we prevent new litters and gradually reduce colony sizes.',
  },
  {
    icon: '💰',
    title: 'Cost-Effective',
    desc: 'TNR costs significantly less than repeated rounds of trapping and removing cats. It\'s a one-time investment that provides lasting results for communities.',
  },
  {
    icon: '🏘️',
    title: 'Community Benefits',
    desc: 'Neutered cats are quieter, less aggressive, and don\'t spray. TNR reduces nuisance behaviors while keeping familiar community cats in their home territories.',
  },
  {
    icon: '✅',
    title: 'Proven Success',
    desc: 'Studies across the country have shown that TNR programs effectively stabilize and reduce community cat populations over time, with measurable results.',
  },
]

export default function WhyTNR() {
  return (
    <section id="why-tnr" className="py-20 bg-gray-300">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-rust text-center mb-12">Why TNR?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(c => (
            <div key={c.title} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-xl font-bold text-rust mb-3">{c.title}</h3>
              <p className="text-gray-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
