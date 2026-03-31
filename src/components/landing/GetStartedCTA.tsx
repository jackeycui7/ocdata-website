"use client";

import { motion } from "framer-motion";
import { Pickaxe, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const ctas = [
  {
    icon: Pickaxe,
    title: "For Miners",
    desc: "Install the miner skill, start crawling web data, and earn $ocDATA rewards every epoch. No staking required.",
    btn: "Get Started",
    href: "/docs",
    color: "text-cyan",
  },
  {
    icon: ShieldCheck,
    title: "For Validators",
    desc: "Stake AWP on RootNet, evaluate data quality, and earn your share of the validator reward pool.",
    btn: "Learn More",
    href: "/docs",
    color: "text-accent-light",
  },
];

export default function GetStartedCTA() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          Ready to Mine <span className="gradient-text">Structured Data</span>?
        </h2>
        <p className="text-text-muted text-lg">
          Choose your role and start contributing to the network.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ctas.map((cta, i) => (
          <motion.div
            key={cta.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <Card className="h-full flex flex-col">
              <cta.icon className={`w-8 h-8 ${cta.color} mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{cta.title}</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">{cta.desc}</p>
              <Button variant="primary" href={cta.href}>
                {cta.btn} &rarr;
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
