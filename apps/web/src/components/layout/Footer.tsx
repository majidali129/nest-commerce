import { Link } from "react-router"
import { Zap } from "lucide-react"

import { Separator } from "#components/ui/separator"

const footerColumns = [
  {
    title: "About",
    links: ["Our Story", "Careers", "Press"],
  },
  {
    title: "Help",
    links: ["Shipping & Returns", "FAQ", "Contact Us"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
  {
    title: "Social",
    links: ["Instagram", "Twitter", "GitHub"],
  },
]

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">{column.title}</h3>
              <ul className="flex flex-col gap-2">
                {column.links.map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="size-3.5" />
            </span>
            Vantage
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Vantage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
