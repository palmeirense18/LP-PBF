interface ContactInfoBlockProps {
  icon: "address" | "phone" | "email";
  label: string;
  value: string;
  href?: string;
}

const Icon = ({ name }: { name: ContactInfoBlockProps["icon"] }) => {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#2B5BA6",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "address") {
    return (
      <svg {...common}>
        <path d="M12 21 C12 21 5 14 5 9 a7 7 0 0 1 14 0 c0 5 -7 12 -7 12 Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M5 4 H8 L9.5 8 L7.5 9.5 a11 11 0 0 0 5 5 L14 12.5 L18 14 V17 a2 2 0 0 1 -2 2 A14 14 0 0 1 3 6 a2 2 0 0 1 2 -2 Z" />
      </svg>
    );
  }
  // email
  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 6 L12 13 L21 6" />
    </svg>
  );
};

export default function ContactInfoBlock({
  icon,
  label,
  value,
  href,
}: ContactInfoBlockProps) {
  const valueClass = "font-body text-[15px] leading-snug";
  const valueStyle: React.CSSProperties = {
    whiteSpace: "pre-line",
  };

  return (
    <div className="flex flex-col gap-2">
      <Icon name={icon} />
      <span
        className="mt-3 font-display uppercase"
        style={{
          fontSize: "10px",
          fontWeight: 400,
          letterSpacing: "0.42em",
          color: "rgba(192,197,206,0.6)",
        }}
      >
        {label}
      </span>
      {href ? (
        <a
          href={href}
          data-cursor="hover"
          className={`${valueClass} text-bone transition-colors duration-200 hover:text-royal`}
          style={valueStyle}
        >
          {value}
        </a>
      ) : (
        <span
          className={`${valueClass} text-bone`}
          style={valueStyle}
        >
          {value}
        </span>
      )}
    </div>
  );
}
