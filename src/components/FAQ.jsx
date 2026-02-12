import { useState } from 'react'

const faqs = [
  {
    q: 'What is TNR?',
    a: 'TNR stands for Trap-Neuter-Return. It is a humane method of managing community cat populations. Cats are humanely trapped, spayed or neutered by a licensed veterinarian, vaccinated, ear-tipped for identification, and then returned to their outdoor home.',
  },
  {
    q: 'Why not just remove the cats?',
    a: 'Removing cats from an area creates a "vacuum effect." New cats move in to take advantage of available resources, and the cycle starts over. TNR stabilizes the colony — no new kittens are born, and the cats already there keep newcomers away.',
  },
  {
    q: 'What is ear-tipping?',
    a: 'Ear-tipping is the universal sign of a cat that has been through a TNR program. While under anesthesia for surgery, the tip of one ear (usually the left) is painlessly removed. This allows caretakers and animal control to identify altered cats from a distance.',
  },
  {
    q: 'Are community cats a health risk?',
    a: 'Community cats pose very little health risk to humans. Through TNR programs like ours, cats are vaccinated against rabies, further reducing any minimal risk. Studies show that community cats are generally healthy and avoid human contact.',
  },
  {
    q: 'How can I help?',
    a: 'There are many ways to help! You can donate to support our spay/neuter efforts, volunteer your time for trapping and transport, become a colony caretaker, or help spread the word about TNR in your community.',
  },
  {
    q: 'What area does Sam\'s TNR serve?',
    a: 'Sam\'s TNR, Inc. primarily serves the Barney area and northern Brooks County, Georgia. If you have community cats in this area that need TNR services, please reach out to us.',
  },
  {
    q: 'Is Sam\'s TNR a registered nonprofit?',
    a: 'Yes! Sam\'s TNR, Inc. is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent allowed by law.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <section id="faq" className="py-20 bg-gray-200">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-rust text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">{faq.q}</span>
                <span className="text-rust text-xl ml-4">{openIdx === i ? '−' : '+'}</span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
