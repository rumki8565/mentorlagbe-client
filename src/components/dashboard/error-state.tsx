interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-700">Could not load data</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}
