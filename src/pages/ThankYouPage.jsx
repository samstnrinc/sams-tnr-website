export default function ThankYouPage() {
  return (
    <div 
      className="min-h-screen flex items-end justify-center pb-16 px-4"
      style={{
        backgroundImage: 'url(https://i.postimg.cc/FFZFT1MC/Zesty-edited.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">Zesty says, "Thank You!"</h1>
        <p className="text-lg text-white mb-4 leading-relaxed drop-shadow-md">
          Your generous donation makes a real difference for community cats 
          in Brooks County. Every dollar goes directly toward spay/neuter 
          surgeries, vaccinations, and care.
        </p>
        <a
          href="/"
          className="inline-block bg-rust hover:bg-rust/80 text-white px-8 py-3 rounded-lg font-semibold transition-colors mb-6"
        >
          Back to Home
        </a>
        <p className="text-white/80 text-sm drop-shadow-md">
          A tax receipt will be sent to your email. Sam's TNR, Inc. is a 
          registered 501(c)(3) nonprofit organization.
        </p>
      </div>
    </div>
  )
}
