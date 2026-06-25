/**
 * Returns a time-of-day greeting and icon name based on the user's local hour.
 *
 * - 5am–12pm  → "Good morning"  → Sun
 * - 12pm–5pm  → "Good afternoon" → SunMedium
 * - 5pm–5am   → "Good evening"  → Moon
 */
export function getGreeting(): { text: string; icon: "Sun" | "SunMedium" | "Moon" } {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { text: "Good morning", icon: "Sun" };
  }
  if (hour >= 12 && hour < 17) {
    return { text: "Good afternoon", icon: "SunMedium" };
  }
  return { text: "Good evening", icon: "Moon" };
}
