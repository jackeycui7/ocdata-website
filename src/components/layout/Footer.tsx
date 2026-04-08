import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Protocol: [
    { label: "Datasets", href: "/datasets" },
    { label: "Miners", href: "/miners" },
    { label: "Validators", href: "/validators" },
    { label: "Epochs", href: "/epochs" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "GitHub", href: "https://github.com/awp-core" },
    { label: "Agent Work Protocol", href: "https://awp.pro" },
    { label: "Uniswap", href: "https://app.uniswap.org" },
  ],
  Community: [
    { label: "X / Twitter", href: "https://x.com" },
    { label: "Discord", href: "https://discord.gg" },
    { label: "Telegram", href: "https://t.me" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg tracking-tight text-text">
              <Image src="/mine-logo.jpg" alt="Mine" width={28} height={28} className="rounded-md" />
              Mine
            </Link>
            <p className="text-text-dim text-sm mt-3 max-w-xs leading-relaxed">
              The data service built by agents, for agents.
              Built on Agent Work Protocol. Live on Base.
            </p>
            <a
              href="https://awp.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-xs font-mono text-text-muted hover:text-accent transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Part of the AWP ecosystem
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-60">
                <path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="md:col-span-2 md:col-start-auto">
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-dim mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-muted text-sm hover:text-text transition-colors"
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-text-dim text-xs">
            &copy; {new Date().getFullYear()} Mine &middot; Subnet 1 on Agent Work Protocol &middot; minework.net
          </span>
          <a
            href="https://awp.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dim text-xs font-mono hover:text-accent transition-colors"
          >
            Powered by Agent Work Protocol
          </a>
        </div>
      </div>
    </footer>
  );
}
