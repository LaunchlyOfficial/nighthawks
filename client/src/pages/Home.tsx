import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInVariants, staggerChildren } from "@/lib/animations";
import { Shield, Lock, Search } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center bg-[#000000]"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        <motion.div 
          className="container relative z-10 text-center"
          variants={fadeInVariants}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            SECURING THE DIGITAL FRONTIER
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Working with federal agencies to protect against cyber threats and strengthen digital security
          </p>
          <Link href="/apply">
            <Button size="lg" variant="outline" className="text-lg border-2 hover:bg-white hover:text-black transition-all duration-300">
              JOIN THE MISSION
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-32 bg-black">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">WHO WE ARE</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Nighthawk is an elite team of white-hat hackers working in partnership with federal agencies to combat cybercrime and strengthen digital security. Our experts conduct ethical hacking operations, vulnerability assessments, and security research to stay ahead of cyber threats.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-zinc-900">
        <div className="container">
          <h2 className="text-4xl font-bold mb-16 text-center">WHAT WE DO</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <Shield className="h-16 w-16 mb-6 mx-auto text-primary" />
              <h3 className="text-2xl font-bold mb-4">CYBERCRIME PREVENTION</h3>
              <p className="text-gray-300">
                Proactively identifying and preventing cyber threats before they cause harm.
              </p>
            </div>
            <div className="text-center">
              <Lock className="h-16 w-16 mb-6 mx-auto text-primary" />
              <h3 className="text-2xl font-bold mb-4">SECURITY & PROTECTION</h3>
              <p className="text-gray-300">
                Comprehensive security assessments and protection strategies.
              </p>
            </div>
            <div className="text-center">
              <Search className="h-16 w-16 mb-6 mx-auto text-primary" />
              <h3 className="text-2xl font-bold mb-4">ETHICAL HACKING</h3>
              <p className="text-gray-300">
                Authorized security testing to identify vulnerabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-8">READY TO JOIN?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're looking for talented cybersecurity experts to join our mission.
          </p>
          <Link href="/apply">
            <Button size="lg" variant="outline" className="text-lg border-2 hover:bg-white hover:text-black transition-all duration-300">
              APPLY NOW
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}