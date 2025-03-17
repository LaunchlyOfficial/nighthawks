import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInVariants, staggerChildren, matrixBg } from "@/lib/animations";
import { Shield, Lock, Search, Code } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      <motion.section 
        className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-accent overflow-hidden"
        animate={matrixBg}
      >
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1 
              variants={fadeInVariants}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Securing the Digital Frontier
            </motion.h1>
            <motion.p 
              variants={fadeInVariants}
              className="text-xl mb-8 text-muted-foreground"
            >
              We work with the FBI to prevent cybercrime and protect digital assets through ethical hacking.
            </motion.p>
            <motion.div variants={fadeInVariants}>
              <Link href="/apply">
                <Button size="lg" className="text-lg">
                  Join Our Mission
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Who We Are</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                alt="Team working"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg">
                Nighthawk is an elite team of white-hat hackers working in partnership with federal agencies to combat cybercrime and strengthen digital security.
              </p>
              <p className="text-lg">
                Our experts conduct ethical hacking operations, vulnerability assessments, and security research to stay ahead of cyber threats.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/5">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Cybercrime Prevention</h3>
                <p className="text-muted-foreground">
                  We work proactively to identify and prevent cyber threats before they cause harm.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Lock className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Security & Protection</h3>
                <p className="text-muted-foreground">
                  Our team provides comprehensive security assessments and protection strategies.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Code className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Ethical Hacking</h3>
                <p className="text-muted-foreground">
                  We conduct authorized security testing to identify vulnerabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
