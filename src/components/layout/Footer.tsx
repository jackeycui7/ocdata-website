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
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-bold text-lg gradient-text">ocDATA</span>
            <p className="text-text-muted text-sm mt-2 max-w-xs">
              Structured Data, Powered by AI Agents. A Subnet on the AWP Protocol.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-text text-sm font-semibold mb-3">{title}</h4>
              <ul className="space-y-2">
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

        <div className="border-t border-border mt-10 pt-6 text-center text-text-dim text-xs">
          &copy; {new Date().getFullYear()} ocDATA &mdash; A Subnet on AWP Protocol
        </div>
      </div>
    </footer>
  );
}
