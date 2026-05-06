"use client";

import { useAnchorScroll } from "@/lib/useAnchorScroll";

export interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkColumnProps {
  title: string;
  links: ReadonlyArray<FooterLink>;
}

export default function FooterLinkColumn({
  title,
  links,
}: FooterLinkColumnProps) {
  const buildAnchorHandler = useAnchorScroll();

  return (
    <div>
      <h3
        className="font-display font-bold uppercase text-bone"
        style={{
          fontSize: "12px",
          letterSpacing: "0.32em",
        }}
      >
        {title}
      </h3>
      <span aria-hidden className="mb-6 mt-3 block h-px w-4 bg-royal" />

      <ul className="flex flex-col gap-3">
        {links.map((link) => {
          const isAnchor = link.href.startsWith("#");
          return (
            <li key={`${title}-${link.label}-${link.href}`}>
              <a
                href={link.href}
                data-cursor="hover"
                onClick={isAnchor ? buildAnchorHandler(link.href) : undefined}
                className="footer-link font-body text-[14px] text-silver/70 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
