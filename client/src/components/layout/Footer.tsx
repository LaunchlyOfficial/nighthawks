import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="font-bold text-lg mb-4 tracking-wider">NIGHTHAWK</h3>
            <p className="text-gray-400">
              Protecting cyberspace through ethical hacking and security research.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 tracking-wider">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/report">
                  <span className="text-gray-400 hover:text-white cursor-pointer">REPORT CRIME</span>
                </Link>
              </li>
              <li>
                <Link href="/request">
                  <span className="text-gray-400 hover:text-white cursor-pointer">REQUEST PERMISSION</span>
                </Link>
              </li>
              <li>
                <Link href="/apply">
                  <span className="text-gray-400 hover:text-white cursor-pointer">JOIN US</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 tracking-wider">CONTACT</h3>
            <ul className="space-y-2 text-gray-400">
              <a href="mailto:noreply.nighthawk@gmail.com" className="text-blue-500 hover:underline">support@nighthawk.koyeb.app</a>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 tracking-wider">LEGAL</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/terms-of-service">
                  <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-gray-400">
          <div>© {new Date().getFullYear()} Nighthawk. All rights reserved.</div>
          <div className="mt-4">
            Made and designed by Dejvid Gicev | Web25
          </div>
        </div>
      </div>
    </footer>
  );
}
