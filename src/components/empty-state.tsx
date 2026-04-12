type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
