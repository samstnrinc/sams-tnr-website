const services = [
  {
    icon: '🪤',
    title: 'Trap',
    desc: 'We use humane box traps to safely capture community cats. Our experienced volunteers ensure cats are handled with care and minimal stress throughout the trapping process.',
  },
  {
    icon: '🩺',
    title: 'Neuter/Spay & Vaccinate',
    desc: 'Trapped cats are transported to licensed veterinarians for spay/neuter surgery and rabies vaccination. Each cat receives an ear tip — the universal sign of a TNR cat.',
  },
  {
    icon: '🏡',
    title: 'Return',
    desc: 'After recovery, cats are returned to their original location where community caretakers continue to provide food and monitor their health. They live out their lives in familiar territory.',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-rust text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map(s => (
            <div key={s.title} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow border border-gray-200">
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="text-2xl font-bold text-rust mb-4">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
