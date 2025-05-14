export function formatFirestoreTimestamp(timestamp): string {
  const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1_000_000);
  const date = new Date(milliseconds);
  return date.toLocaleString(); // or use toLocaleDateString(), toISOString(), etc.
}

export const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
