export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-end justify-center text-white text-center pb-20"
      style={{
        backgroundImage: 'url(https://i.postimg.cc/FFZFT1MC/Zesty-edited.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 px-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Sam's TNR, Inc.</h1>
        <p className="text-xl md:text-2xl mb-6">
          Helping community cats in Barney and northern Brooks County, Georgia through
          Trap-Neuter-Return
        </p>
      </div>
    </section>
  )
}
