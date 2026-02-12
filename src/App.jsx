import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Mission from './components/Mission'
import WhyTNR from './components/WhyTNR'
import Services from './components/Services'
import Gallery from './components/Gallery'
import FAQ from './components/FAQ'
import Donate from './components/Donate'
import Contact from './components/Contact'
import Footer from './components/Footer'
import IntakeForm from './pages/IntakeForm'
import VolunteerForm from './pages/VolunteerForm'
import TrapLoanForm from './pages/TrapLoanForm'
import ColonyRegistrationForm from './pages/ColonyRegistrationForm'
import PostSurgeryForm from './pages/PostSurgeryForm'
import TransportAuthForm from './pages/TransportAuthForm'
import FosterForm from './pages/FosterForm'
import DonationReceipt from './pages/DonationReceipt'
import IncidentReportForm from './pages/IncidentReportForm'
import PropertyAccessForm from './pages/PropertyAccessForm'

function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <WhyTNR />
      <Services />
      <Gallery />
      <FAQ />
      <Donate />
      <Contact />
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intake" element={<IntakeForm />} />
        <Route path="/volunteer" element={<VolunteerForm />} />
        <Route path="/trap-loan" element={<TrapLoanForm />} />
        <Route path="/colony-register" element={<ColonyRegistrationForm />} />
        <Route path="/post-surgery" element={<PostSurgeryForm />} />
        <Route path="/transport-auth" element={<TransportAuthForm />} />
        <Route path="/foster" element={<FosterForm />} />
        <Route path="/donation-receipt" element={<DonationReceipt />} />
        <Route path="/incident-report" element={<IncidentReportForm />} />
        <Route path="/property-access" element={<PropertyAccessForm />} />
      </Routes>
      <Footer />
    </div>
  )
}
