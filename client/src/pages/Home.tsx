import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Search } from "lucide-react";
import { Link } from "wouter";
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, #000000, #FF0080, #000000)",
              "linear-gradient(45deg, #000000, #7000FF, #000000)",
              "linear-gradient(45deg, #FF0080, #000000, #7000FF)",
              "linear-gradient(45deg, #000000, #FF0080, #000000)"
            ],
            transition: {
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />

        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

        {/* Content overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />

        {/* Hero Content */}
        <motion.div 
          className="container max-w-5xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF0080] to-white">
              WE ARE{" "}
            </span>
            <br />
            <span className="text-white">
              <TypeAnimation
                sequence={[
                  '{PROTECTING YOU}',
                  3000,
                  '{HELPING YOU}',
                  3000,
                  '{TEACHING YOU}',
                  3000,
                  'NIGHTHAWK',
                  6000,
                ]}
                wrapper="span"
                speed={225}
                repeat={Infinity}
                className="text-[#FF0080]"
              />
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
            Working with federal agencies to protect against cyber threats and strengthen digital security
          </p>
          <div className="flex justify-center">
            <Link href="/apply">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg bg-transparent text-black border-2 border-black 
                          hover:bg-black/10 hover:text-black hover:border-black 
                          transition-all duration-500"
              >
                JOIN THE MISSION
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-black">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-center">WHO WE ARE</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Nighthawk is an elite team of white-hat hackers working in partnership with federal agencies to combat cybercrime and strengthen digital security. Our experts conduct ethical hacking operations, vulnerability assessments, and security research to stay ahead of cyber threats.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-zinc-900">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">WHAT WE DO</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <Shield className="h-16 w-16 mb-6 mx-auto text-[#FF0080]" />
              <h3 className="text-2xl font-bold mb-4">CYBERCRIME PREVENTION</h3>
              <p className="text-gray-300">
                Proactively identifying and preventing cyber threats before they cause harm.
              </p>
            </div>
            <div className="text-center">
              <Lock className="h-16 w-16 mb-6 mx-auto text-[#FF0080]" />
              <h3 className="text-2xl font-bold mb-4">SECURITY & PROTECTION</h3>
              <p className="text-gray-300">
                Comprehensive security assessments and protection strategies.
              </p>
            </div>
            <div className="text-center">
              <Search className="h-16 w-16 mb-6 mx-auto text-[#FF0080]" />
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
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">READY TO JOIN?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're looking for talented cybersecurity experts to join our mission.
          </p>
          <Link href="/apply">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg border-2 bg-[hsl(0deg_0%_0%_/_0%)] hover:bg-[#FF0080] hover:border-[#FF0080] hover:text-white transition-all duration-500"
            >
              APPLY NOW
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}