"use client";

import { motion } from "framer-motion";
import { Pickaxe, ShieldCheck, Crown } from "lucide-react";
import Card from "@/components/ui/Card";

const roles = [
  {
    icon: Pickaxe,
    title: "Miner",
    share: "41%",
    color: "text-cyan",
    duties: [
      "Crawl target URLs",
      "Clean & structure data",
      "Submit results each epoch",
      "No staking required",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Validator",
    share: "41%",
    color: "text-accent-light",
    duties: [
      "Evaluate data quality",
      "Score structured extractions",
      "Participate in Peer Review",
      "Stake AWP to join",
    ],
  },
  {
    icon: Crown,
    title: "Subnet Owner",
    share: "18%",
    color: "text-warn",
    duties: [
      "Operate the subnet",
      "Maintain Golden Task library",
      "Review DataSet proposals",
      "Upgrade Miner Skill",
    ],
  },
];

export default function ProtocolOverview() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-2">Protocol Roles</h2>
      <p className="text-text-muted text-lg mb-10">
        Three roles collaborate to produce and verify high-quality structured data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-3 mb-4">
                <role.icon className={`w-6 h-6 ${role.color}`} />
                <h3 className="text-lg font-semibold">{role.title}</h3>
                <span className="ml-auto font-mono text-sm gradient-text font-bold">
                  {role.share}
                </span>
              </div>
              <ul className="space-y-2">
                {role.duties.map((d) => (
                  <li key={d} className="text-text-muted text-sm flex items-start gap-2">
                    <span className="text-cyan mt-0.5">&#8226;</span>
                    {d}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
