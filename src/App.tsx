import { useTranslation } from 'react-i18next'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { Footer } from './components/layout/Footer.tsx'
import { Navbar } from './components/layout/Navbar.tsx'
import { ScrollToTop } from './components/layout/ScrollToTop.tsx'
import { About } from './pages/About.tsx'
import { Account } from './pages/Account.tsx'
import { Contact } from './pages/Contact.tsx'
import { ForgotPassword } from './pages/ForgotPassword.tsx'
import { Gallery } from './pages/Gallery.tsx'
import { GuestAccess } from './pages/GuestAccess.tsx'
import { Home } from './pages/Home.tsx'
import { Login } from './pages/Login.tsx'
import { NotFound } from './pages/NotFound.tsx'
import { OrderConfirmation } from './pages/OrderConfirmation.tsx'
import { PracticalInformation } from './pages/PracticalInformation.tsx'
import { Register } from './pages/Register.tsx'
import { TreatmentDetails } from './pages/TreatmentDetails.tsx'
import { Treatments } from './pages/Treatments.tsx'
import { VoucherCatalogue } from './pages/VoucherCatalogue.tsx'
import { VoucherPurchase } from './pages/VoucherPurchase.tsx'

function PublicSite() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-beige text-ink">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-med"
      >
        {t('common.skip')}
      </a>
      <Navbar />
      <main id="contenu" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicSite />}>
          <Route path="/" element={<Home />} />
          <Route path="/la-station" element={<About />} />
          <Route path="/soins" element={<Treatments />} />
          <Route path="/soins/:slug" element={<TreatmentDetails />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/informations" element={<PracticalInformation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bons" element={<VoucherCatalogue />} />
          <Route path="/bons/:slug" element={<VoucherPurchase />} />
          <Route path="/compte/connexion" element={<Login />} />
          <Route path="/compte/inscription" element={<Register />} />
          <Route path="/compte/mot-de-passe" element={<ForgotPassword />} />
          <Route path="/compte" element={<Account />} />
          <Route path="/commande/acces" element={<GuestAccess />} />
          <Route path="/commande/:id" element={<OrderConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
