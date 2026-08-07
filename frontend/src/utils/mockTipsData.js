// Offline fallback for the Local Climate Tips screen — mirrors the shape
// of GET /api/education/regional-tips.
export const FALLBACK_REGIONAL_TIPS = (region) => ({
  region,
  summary: `General climate resilience guidance for ${region} — connect to the internet for tips tailored to your exact area.`,
  dailyTip: 'Conserve water and fix leaks — rainfall patterns are becoming less predictable across Cameroon.',
  tips: [
    'Conserve water — fix leaks and collect rainwater where possible.',
    'Plant and protect trees around your home to cool the air and stabilize soil.',
    'Reduce, reuse, and properly dispose of waste to avoid blocked drains and air pollution.',
    'Stay informed on local weather alerts and know your area\'s flood/heat risk.',
  ],
});
