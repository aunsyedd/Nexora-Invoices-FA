interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="bg-blue-600 text-white px-4 py-2">
      <span className="font-semibold text-sm uppercase tracking-wide">{title}</span>
    </div>
  );
}
