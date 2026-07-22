export function formatSGD(amount: number): string {
  return `S$${amount.toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCountdown(totalMinutes: number): string {
  if (totalMinutes <= 0) return "Deadline passed";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return `${m}m left`;
  return `${h}h ${m}m left`;
}

export function formatDueIn(totalMinutes: number): string {
  if (totalMinutes <= 0) return "Deadline passed";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return `due in ${m}m`;
  if (m === 0) return `due in ${h}h`;
  return `due in ${h}h${m}m`;
}
