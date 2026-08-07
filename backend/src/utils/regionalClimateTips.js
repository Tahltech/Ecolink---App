/**
 * Actionable, location-specific climate tips — "how to make YOUR area's
 * climate more comfortable/better" — used for the daily push notification
 * feed and the in-app Local Climate Tips screen. Keyed by both the 10
 * official regions and major cities (city entries are more specific and
 * take priority when a user's profile/GPS resolves to one).
 */
const REGIONAL_TIPS = {
  douala: {
    summary: 'Cameroon\'s economic capital faces urban flooding, poor drainage, heat islands, and air pollution from traffic and industry.',
    tips: [
      'Clear leaves and waste from gutters and drains near your home before the rainy season peaks — blocked drains are the #1 cause of street flooding in Douala.',
      'Plant shade trees or leafy potted plants around your compound to cool concrete-heavy neighborhoods and cut the urban heat-island effect.',
      'Avoid burning household waste — open burning is a major source of Douala\'s air pollution; use registered waste collection (HYSACAM) instead.',
      'Elevate electrical outlets and store valuables above flood level if you\'re in a low-lying area like Ndogbong, Makepe, or Bonaberi.',
      'Use a fan or natural cross-ventilation instead of running AC constantly during heat spikes — it cuts both your bill and citywide energy demand.',
    ],
  },
  yaounde: {
    summary: 'Yaoundé\'s hilly terrain channels heavy rain into fast-moving runoff, causing flash flooding and erosion in low-lying quarters.',
    tips: [
      'Report blocked or overflowing drains in your quartier to the council — silted drains are why areas like Mfoundi and Ekounou flood fastest.',
      'Avoid building or dumping waste on steep slopes — it accelerates erosion that silts up the drainage system further downhill.',
      'Harvest rainwater from your roof in covered containers for dry-season use and to reduce runoff volume during storms.',
      'Support neighborhood tree-planting on bare hillsides — root systems stabilize soil and reduce landslide risk.',
      'Keep an emergency kit (torch, radio, first aid) ready during rainy season — flash floods in Yaoundé can develop within an hour of heavy rain.',
    ],
  },
  bamenda: {
    summary: 'Bamenda\'s highland climate brings cool, misty conditions with occasional heavy storms and landslide-prone slopes.',
    tips: [
      'Reinforce homes built on the escarpment with proper drainage channels — Bamenda\'s slopes are prone to landslides after prolonged rain.',
      'Layer clothing for the cool mornings/evenings and mist rather than relying on heating, which raises household energy use.',
      'Protect and replant around water catchments in the highlands — they supply much of the city\'s drinking water.',
      'Store dry-season firewood sustainably and consider fuel-efficient stoves to reduce pressure on surrounding forests.',
    ],
  },
  buea: {
    summary: 'At the foot of Mount Cameroon, Buea gets heavy year-round rainfall with landslide and flash-flood risk on the mountain\'s slopes.',
    tips: [
      'Avoid new construction directly on steep volcanic slopes — they\'re prone to fast-moving landslides after heavy rain.',
      'Keep drainage channels around your home clear — Buea\'s rainfall is among the highest in Cameroon and drains fill quickly.',
      'Carry a light raincoat and waterproof footwear most of the year rather than relying on umbrellas alone in wind-driven rain.',
      'Support forest conservation on Mount Cameroon\'s slopes — intact forest cover is what slows runoff and prevents mudslides.',
    ],
  },
  garoua: {
    summary: 'Garoua sits in Cameroon\'s hot Sudano-Sahelian belt, with intense dry-season heat and short, sometimes violent rainy-season storms.',
    tips: [
      'Stay hydrated and limit outdoor work between 12pm–4pm during the hot season to avoid heat exhaustion.',
      'Use light-colored, loose cotton clothing and wide-brim hats to reflect heat rather than trap it.',
      'Mulch garden and farm soil to retain scarce moisture during long dry spells.',
      'Store water safely ahead of dry-season shortages, and use drip or bucket irrigation instead of open flooding to conserve it.',
    ],
  },
  maroua: {
    summary: 'Maroua and the Far North face the country\'s most severe heat, desertification, and water scarcity.',
    tips: [
      'Plant and maintain drought-resistant trees (like acacia or neem) around your home for shade and to help hold back desertification.',
      'Prioritize millet, sorghum, and cowpea over water-hungry crops given increasingly short, unpredictable rains.',
      'Use covered storage for any collected water to reduce evaporation loss in the extreme heat.',
      'Check on elderly neighbors during heat waves — heat stroke risk is highest for the elderly and outdoor laborers in this region.',
    ],
  },
  centre: {
    summary: 'The Centre region sees heavy rainy seasons with flash-flood and erosion risk around Yaoundé and surrounding towns.',
    tips: [
      'Keep local drainage clear of waste and leaves ahead of the rainy season.',
      'Support community tree-planting to stabilize soil on cleared or sloped land.',
      'Harvest rainwater where possible to ease pressure on the water supply during dry spells.',
      'Know your area\'s flood history and keep an emergency kit ready during peak rainy months (Sept–Nov).',
    ],
  },
  littoral: {
    summary: 'The coastal Littoral region combines urban flooding around Douala with coastal erosion and saltwater intrusion further along the shore.',
    tips: [
      'Clear gutters and drains regularly — poor drainage is the main driver of flooding across the region\'s cities.',
      'Avoid clearing coastal mangroves — they buffer storm surge and slow coastal erosion.',
      'Test well water for salinity if you\'re near the coast; saltwater intrusion is increasing as sea levels rise.',
      'Use fuel-efficient or electric transport options where possible to cut emissions in the region\'s traffic-heavy cities.',
    ],
  },
  west: {
    summary: 'The West region\'s volcanic highlands bring cooler temperatures, fertile soil, and occasional heavy-rain landslide risk.',
    tips: [
      'Terrace farmland on slopes to reduce soil erosion during heavy rains.',
      'Protect remaining forest patches on hillsides — they anchor soil and regulate local rainfall.',
      'Use cool-morning hours for physically demanding outdoor work.',
      'Diversify crops to buffer against increasingly unpredictable rainfall timing.',
    ],
  },
  northwest: {
    summary: 'The Northwest highlands are cool and misty with landslide-prone terrain and increasing dry-season water stress.',
    tips: [
      'Reinforce drainage on hillside homes and paths ahead of the rainy season.',
      'Protect highland water catchments and springs from deforestation and grazing pressure.',
      'Use fuel-efficient stoves to reduce firewood demand on local forests.',
      'Layer clothing for cool, misty mornings rather than over-heating indoor spaces.',
    ],
  },
  southwest: {
    summary: 'The Southwest gets very heavy rainfall (among the highest in Africa near Mount Cameroon) plus coastal flooding and erosion around Limbe and Tiko.',
    tips: [
      'Maintain clear drainage year-round — this region\'s rainfall is intense even by Cameroonian standards.',
      'Avoid new coastal construction without erosion buffers near Limbe\'s shoreline.',
      'Support mangrove and forest conservation, which reduce both flood and landslide risk.',
      'Keep waterproof gear on hand for most of the year rather than just "rainy season."',
    ],
  },
  south: {
    summary: 'The South region\'s dense rainforest sees heavy rainfall, flooding, and increasing pressure from deforestation.',
    tips: [
      'Support sustainable, certified timber and farming practices — deforestation here reduces regional rainfall regulation.',
      'Keep home and farm drainage clear during the long rainy season.',
      'Diversify into shade-tolerant crops like cocoa understory planting to preserve forest cover while farming.',
      'Protect waterways from agricultural runoff to keep drinking water sources clean.',
    ],
  },
  east: {
    summary: 'The East region\'s vast forest cover regulates regional climate, but logging and heavy rains bring flooding and erosion risk along rivers.',
    tips: [
      'Support community forest management — the East\'s forests are a major regional carbon sink.',
      'Avoid settling or farming directly on riverbanks prone to seasonal flooding.',
      'Use sustainable charcoal/firewood practices to reduce pressure on old-growth forest.',
      'Protect local water sources from erosion by maintaining vegetation buffers along streams.',
    ],
  },
  adamawa: {
    summary: 'Adamawa\'s highland plateau has a milder climate than the far north but faces increasing dry-season water stress for grazing and farming.',
    tips: [
      'Rotate grazing land to prevent overgrazing and soil degradation during dry spells.',
      'Build small water-retention ponds to store rainy-season water for dry-season use.',
      'Plant windbreak trees around farmland to reduce topsoil loss.',
      'Monitor pasture conditions closely — reduced rainfall is shortening the safe grazing season.',
    ],
  },
  north: {
    summary: 'The North region faces intense heat, an increasingly short rainy season, and growing water scarcity.',
    tips: [
      'Use drip irrigation or covered storage to make the most of limited water.',
      'Favor drought-resistant crops (sorghum, millet, cowpea) over thirsty alternatives.',
      'Provide shaded shelter and extra water for livestock during peak heat.',
      'Plant trees around homes and fields to reduce heat and slow desertification.',
    ],
  },
  'far north': {
    summary: 'The Far North is Cameroon\'s most climate-stressed region — extreme heat, desertification, drought, and food insecurity.',
    tips: [
      'Prioritize drought-resistant crops and short-cycle varieties given increasingly unreliable rains.',
      'Join or support local reforestation/anti-desertification efforts (e.g. tree-planting around Maroua and Kousseri).',
      'Store water in covered containers to minimize evaporation loss in extreme heat.',
      'Check on children, elderly, and outdoor workers during heat waves — heat stroke risk is highest here nationally.',
    ],
  },
};

const GENERAL_TIPS = {
  summary: 'General climate resilience tips for Cameroon — useful anywhere your exact region isn\'t listed yet.',
  tips: [
    'Conserve water — fix leaks and collect rainwater where possible; rainfall patterns are becoming less predictable nationwide.',
    'Plant and protect trees around your home — they cool the air, stabilize soil, and absorb CO2.',
    'Reduce, reuse, and properly dispose of waste — open burning and blocked drains worsen both air quality and flood risk.',
    'Stay informed on local weather alerts and know your area\'s flood/heat risk ahead of time.',
  ],
};

const normalize = (region) => (region || '').toLowerCase().trim().replace(/_/g, ' ');

const getTipsForRegion = (region) => REGIONAL_TIPS[normalize(region)] || GENERAL_TIPS;

/**
 * Deterministically rotates through a region's tip list by day-of-year, so
 * the "daily" tip actually changes day to day instead of always being #1.
 */
const getDailyTipForRegion = (region, date = new Date()) => {
  const set = getTipsForRegion(region);
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  const tip = set.tips[dayOfYear % set.tips.length];
  return { region: normalize(region) || 'general', summary: set.summary, tip };
};

module.exports = { REGIONAL_TIPS, GENERAL_TIPS, getTipsForRegion, getDailyTipForRegion };
