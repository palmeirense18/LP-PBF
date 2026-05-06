interface EquipmentSpecRowProps {
  label: string;
  value: string;
}

export default function EquipmentSpecRow({
  label,
  value,
}: EquipmentSpecRowProps) {
  return (
    <>
      <dt
        className="font-body uppercase text-silver"
        style={{
          fontSize: "12px",
          fontWeight: 400,
          letterSpacing: "0.18em",
        }}
      >
        {label}
      </dt>
      <dd
        className="font-display text-bone"
        style={{ fontSize: "14px", fontWeight: 400 }}
      >
        {value}
      </dd>
    </>
  );
}
