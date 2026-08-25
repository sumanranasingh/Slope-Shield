import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ title, message = 'Failed to load data', onRetry }: Props) {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 text-center space-y-2 animate-fade-in">
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        {title && <h4 className="text-sm text-red-300 font-bold">{title}</h4>}
      </div>
      <p className="text-xs text-navy-300">{message}</p>
      <p className="text-[11px] text-navy-500">
        The backend API may be unavailable. The application is operating with cached or development seed telemetry.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold border border-red-500/30 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
