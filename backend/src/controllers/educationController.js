const { asyncHandler, success } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');
const supabaseService = require('../services/supabaseService');
const { getTipsForRegion, getDailyTipForRegion } = require('../utils/regionalClimateTips');

// Real, independently verified Cameroon-focused climate organizations —
// each `source_url` is the organization's own site (or nearest official
// page) so the app never presents claims without an attributable source.
const STATIC_INITIATIVES = [
  {
    name: 'MINEPDED — Ministry of Environment, Nature Protection & Sustainable Development',
    description: "Cameroon's government ministry responsible for national environmental policy, climate strategy, and sustainable development planning.",
    focus_area: 'Government policy',
    region: 'National',
    source_url: 'https://www.minepded.gov.cm/',
  },
  {
    name: 'WWF Cameroon',
    description: 'Runs the Climate and Energy Programme, promoting renewable energy access and integrating climate adaptation into national planning and the Congo Basin landscape.',
    focus_area: 'Climate & energy, conservation',
    region: 'National',
    source_url: 'https://cameroon.panda.org/our_work/climate_and_energy/',
  },
  {
    name: 'Greenpeace Africa — Climate Justice Movement (Cameroon)',
    description: 'A coalition of civil society, Indigenous communities, and young people advocating for environmental justice and sustainable governance of natural resources in Cameroon.',
    focus_area: 'Advocacy & climate justice',
    region: 'National',
    source_url: 'https://www.greenpeace.org/africa/en/tag/cameroon/',
  },
  {
    name: 'Africa Climate and Environment Foundation (ACEF)',
    description: 'Cameroon-based foundation partnering with regional development authorities (e.g. SOWEDA) on climate and environmental programs in the Southwest.',
    focus_area: 'Regional partnerships',
    region: 'Southwest',
    source_url: 'https://acef-ngo.org/',
  },
  {
    name: 'Cameroon Gender and Environment Watch (CAMGEW)',
    description: 'Reforestation and agroforestry NGO in the Northwest, known for restoring the Kilum-Ijim forest and training farmers in climate-smart, women-led agriculture.',
    focus_area: 'Reforestation & agroforestry',
    region: 'Northwest',
    source_url: 'https://www.camgew.org/',
  },
  {
    name: 'Voice of Nature (VoNat)',
    description: 'Buea-based youth conservation organization building climate resilience and biodiversity protection through community science and environmental education.',
    focus_area: 'Youth education & conservation',
    region: 'Southwest',
    source_url: 'https://vonat.org/',
  },
  {
    name: 'Cameroon Red Cross Society (Croix-Rouge Camerounaise)',
    description: 'National humanitarian society leading flood and disaster preparedness, emergency response, and community climate-risk awareness across Cameroon.',
    focus_area: 'Disaster preparedness & response',
    region: 'National',
    source_url: 'https://www.lacroix-rougecamerounaise.org/',
  },
  {
    name: 'UNICEF Cameroon — Climate Action',
    description: "UNICEF's Climate, Energy, Environment and Children Strategy for Cameroon, protecting children from climate impacts and empowering youth climate education.",
    focus_area: 'Child-focused climate policy',
    region: 'National',
    source_url: 'https://www.unicef.org/cameroon/climate-action',
  },
  {
    name: 'Soft Power Global',
    description: 'Youth and women-led NGO advancing climate and social justice through communication, education, and advocacy — developing climate-literate youth leaders skilled in waste management, circular economy, climate governance, and environmental conservation. Follow their page for ongoing updates.',
    focus_area: 'Youth & women-led advocacy',
    region: 'National',
    source_url: 'https://www.linkedin.com/company/soft-power-global/',
  },
];

const STATIC_EDUCATION = [
  { title: 'Climate Change', category: 'Fundamentals', content: 'Climate change refers to long-term shifts in temperatures and weather patterns, largely driven by human activities such as burning fossil fuels.' },
  { title: 'Global Warming', category: 'Fundamentals', content: 'Global warming is the rise in Earth\'s average surface temperature due to greenhouse gas emissions trapping heat in the atmosphere.' },
  { title: 'Greenhouse Gases', category: 'Fundamentals', content: 'CO₂, methane, and nitrous oxide trap heat. Deforestation and fossil fuels increase atmospheric concentrations.' },
  { title: 'Northern Cameroon — Desertification', category: 'Cameroon Regions', content: 'The Far North and North regions face expanding desertification, reduced rainfall, water scarcity, and declining crop yields.' },
  { title: 'Southern Cameroon — Flooding', category: 'Cameroon Regions', content: 'Heavy rainfall in the South and Southwest causes flooding, landslides, and forest degradation.' },
  { title: 'Coastal Areas — Sea Level Rise', category: 'Cameroon Regions', content: 'Coastal erosion, saltwater intrusion, and risks to fishing communities affect Limbe, Kribi, and Douala.' },
  { title: 'Yaoundé & Douala — Urban Flooding', category: 'Cameroon Regions', content: 'Poor drainage, rapid urbanization, and heat islands increase flood and air pollution risks in major cities.' },
  { title: 'Disaster Preparedness', category: 'Action', content: 'Prepare emergency kits, know evacuation routes, monitor weather alerts, and report flooding through community channels.' },
  { title: 'Water Conservation', category: 'Action', content: 'Harvest rainwater, fix leaks, use efficient irrigation, and protect watersheds to adapt to changing rainfall.' },
  { title: 'Renewable Energy', category: 'Solutions', content: 'Solar, hydro, and wind energy reduce emissions and improve energy access in rural Cameroon.' },
];

const STATIC_TIPS = [
  { title: 'Save Water', description: 'Fix leaks and use rainwater harvesting during dry seasons.' },
  { title: 'Plant Trees', description: 'Trees absorb CO₂ and reduce erosion in flood-prone areas.' },
  { title: 'Reduce Waste', description: 'Compost organic waste and recycle plastics to cut landfill methane.' },
];

const STATIC_DISEASES = [
  { disease_name: 'Malaria', symptoms: 'Fever, chills, headache', prevention: 'Use bed nets, eliminate standing water', climate_relation: 'Increased rainfall and temperature expand mosquito breeding areas', recommended_action: 'Seek medical care within 24 hours of fever' },
  { disease_name: 'Cholera', symptoms: 'Diarrhea, dehydration', prevention: 'Boil water, wash hands', climate_relation: 'Floods contaminate water supplies', recommended_action: 'Oral rehydration and urgent medical care' },
  { disease_name: 'Heat Stroke', symptoms: 'High body temperature, confusion', prevention: 'Stay hydrated, avoid midday sun', climate_relation: 'Extreme heat events increasing in northern regions', recommended_action: 'Move to shade, cool body, call emergency services' },
];

const listContent = asyncHandler(async (req, res) => {
  let content = await supabaseService.getEducationalContent({
    category: req.query.category,
    limit: Number(req.query.limit) || 50,
  });
  if (!content.length) content = STATIC_EDUCATION.filter((c) => !req.query.category || c.category === req.query.category);
  return success(res, { content });
});

const getContent = asyncHandler(async (req, res) => {
  try {
    const content = await supabaseService.getEducationalContentById(req.params.id);
    return success(res, { content });
  } catch {
    const idx = Number(req.params.id);
    const item = STATIC_EDUCATION[idx];
    if (!item) throw new AppError('Content not found', 404);
    return success(res, { content: { ...item, id: String(idx) } });
  }
});

const listTips = asyncHandler(async (req, res) => {
  let tips = await supabaseService.getClimateTips(Number(req.query.limit) || 20);
  if (!tips.length) tips = STATIC_TIPS;
  return success(res, { tips });
});

const listDiseases = asyncHandler(async (req, res) => {
  let diseases = await supabaseService.getDiseaseInformation();
  if (!diseases.length) diseases = STATIC_DISEASES;
  return success(res, { diseases });
});

const getDisease = asyncHandler(async (req, res) => {
  try {
    const disease = await supabaseService.getDiseaseById(req.params.id);
    return success(res, { disease });
  } catch {
    const idx = Number(req.params.id);
    const disease = STATIC_DISEASES[idx];
    if (!disease) throw new AppError('Disease not found', 404);
    return success(res, { disease: { ...disease, id: String(idx) } });
  }
});

const listInitiatives = asyncHandler(async (req, res) => {
  let initiatives = [];
  try {
    initiatives = await supabaseService.getClimateInitiatives();
  } catch {
    // Table not migrated yet in this Supabase project — fall back to the
    // built-in list rather than failing the request.
  }
  if (!initiatives.length) initiatives = STATIC_INITIATIVES;
  return success(res, { initiatives });
});

const getRegionalTips = asyncHandler(async (req, res) => {
  const region = req.query.region || req.user?.region;
  const daily = getDailyTipForRegion(region);
  const all = getTipsForRegion(region);
  return success(res, { region: daily.region, summary: all.summary, dailyTip: daily.tip, tips: all.tips });
});

module.exports = {
  listContent,
  getContent,
  listTips,
  listDiseases,
  getDisease,
  listInitiatives,
  getRegionalTips,
};
