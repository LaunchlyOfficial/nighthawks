import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Nighthawk</h3>
          <p className="text-sm text-muted-foreground">
            Protecting cyberspace through ethical hacking and security research.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/report">Report Crime</Link>
            </li>
            <li>
              <Link href="/request">Request Permission</Link>
            </li>
            <li>
              <Link href="/apply">Join Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: contact@nighthawk.org</li>
            <li>Phone: (555) 123-4567</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nighthawk. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
