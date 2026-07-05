"use client";

interface DateTimePickerProps {
  scheduledFor: string | null;
  onScheduleChange: (dateTime: string) => void;
}

export default function DateTimePicker({
  scheduledFor,
  onScheduleChange,
}: DateTimePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScheduleChange(new Date(e.target.value).toISOString());
  };

  const formatDateTimeLocal = (isoString: string | null): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        Schedule Date & Time
      </label>
      <input
        type="datetime-local"
        value={formatDateTimeLocal(scheduledFor)}
        onChange={handleChange}
        min={new Date().toISOString().slice(0, 16)}
        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {scheduledFor && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Scheduled for: {new Date(scheduledFor).toLocaleString()}
        </p>
      )}
    </div>
  );
}
