interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-8 mb-10 border-b border-ink/10">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="font-display text-3xl md:text-4xl text-ink mt-2">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-mid mt-2 max-w-xl">{description}</p>
        )}
      </div>
      {action}
    </header>
  );
}
