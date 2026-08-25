interface Props {
  message?: string;
  rows?: number;
}

export default function LoadingState({ message = 'Loading data...', rows = 4 }: Props) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-navy-400">
        <span className="w-4 h-4 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
        <span>{message}</span>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-navy-800/60 rounded-xl p-5 border border-navy-700/40 space-y-3">
          <div className="h-4 w-1/3 bg-navy-700/60 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-navy-700/40 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-navy-700/30 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
