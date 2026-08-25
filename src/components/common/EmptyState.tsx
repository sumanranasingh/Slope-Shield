import { Inbox } from 'lucide-react';

interface Props {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No data available',
  message = 'There are no records to display for the current filters.',
  icon,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 animate-fade-in">
      {icon || <Inbox className="w-10 h-10 text-navy-600" />}
      <h3 className="text-sm font-semibold text-navy-300">{title}</h3>
      <p className="text-xs text-navy-500 max-w-sm">{message}</p>
    </div>
  );
}
