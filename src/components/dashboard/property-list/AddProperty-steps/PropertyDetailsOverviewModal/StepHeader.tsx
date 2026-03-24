// components/properties/apply-for-rent/StepHeader.tsx

interface StepHeaderProps {
  index: number | string;
  title: string;
}

export default function StepHeader({ index, title }: StepHeaderProps) {
  return (
    <div className="flex items-center gap-2 py-4">
      <h2 className="text-base sm:text-lg font-normal whitespace-nowrap">
        {index}. {title}
      </h2>
      <div className="flex-grow h-px bg-border" />
    </div>
  );
}
