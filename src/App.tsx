import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { LeadCapture } from './components/LeadCapture';
import { Contact } from './components/Contact';

export function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <LeadCapture />
        <Contact />
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Full Scope MSP</h3>
              <p className="text-gray-400">
                Experienced IT and Cybersecurity Experts You Can Count On
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: contact@fullscopemsp.com</p>
              <p className="text-gray-400">Phone: (951) 717-8781</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="text-gray-400 space-y-2">
                <li>Managed IT Services</li>
                <li>Security Solutions</li>
                <li>24/7 SOC/SIEM</li>
                <li>Incident Response</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Full Scope MSP. All rights reserved.</p>
            <p className="text-gray-400 mt-2">Veteran-Owned and Operated</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;