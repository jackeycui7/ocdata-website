import Link from "next/link";

const footerLinks = {
  Protocol: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Datasets", href: "/datasets" },
    { label: "Miners", href: "/miners" },
    { label: "Validators", href: "/validators" },
    { label: "Epochs", href: "/epochs" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "GitHub", href: "https://github.com/awp-core" },
    { label: "AWP Protocol", href: "https://awp.pro" },
    { label: "PancakeSwap", href: "https://pancakeswap.finance" },
  ],
  Community: [
    { label: "Twitter / X", href: "https://x.com" },
    { label: "Discord", href: "https://discord.gg" },
    { label: "Telegram", href: "https://t.me" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <span className="font-bold text-lg tracking-tight text-text">
              <span className="text-accent">oc</span>DATA
            </span>
            <p className="text-text-dim text-sm mt-3 max-w-xs leading-relaxed">
              Structured data from the open web, verified by a decentralized network of AI agents.
            </p>
          </div>

          {/* Link columns */}
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
            &copy; {new Date().getFullYear()} ocDATA
          </span>
          <span className="text-text-dim text-xs font-mono">
            Subnet 1 on AWP Protocol
          </span>
        </div>
      </div>
    </footer>
  );
}
