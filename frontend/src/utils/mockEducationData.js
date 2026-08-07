// Mirrors backend/src/controllers/educationController.js STATIC_EDUCATION so
// the screen stays fully populated even before Supabase content is seeded.
export const FALLBACK_EDUCATION = [
  { id: 'e1', title: 'Climate Change', category: 'Fundamentals', content: 'Climate change refers to long-term shifts in temperatures and weather patterns, largely driven by human activities such as burning fossil fuels.' },
  { id: 'e2', title: 'Global Warming', category: 'Fundamentals', content: "Global warming is the rise in Earth's average surface temperature due to greenhouse gas emissions trapping heat in the atmosphere." },
  { id: 'e3', title: 'Greenhouse Gases', category: 'Fundamentals', content: 'CO2, methane, and nitrous oxide trap heat. Deforestation and fossil fuels increase atmospheric concentrations.' },
  { id: 'e4', title: 'Air Pollution', category: 'Fundamentals', content: 'Vehicle emissions, open burning, and industry release particulates and gases that harm lungs and worsen warming.' },
  { id: 'e5', title: 'Water Pollution', category: 'Fundamentals', content: 'Runoff, waste dumping, and flooding contaminate rivers and wells, a growing risk as rainfall patterns shift.' },
  { id: 'e6', title: 'Waste Management', category: 'Action', content: 'Sorting, composting, and reducing single-use plastics cut methane emissions from landfills.' },
  { id: 'e7', title: 'Renewable Energy', category: 'Solutions', content: 'Solar, hydro, and wind energy reduce emissions and improve energy access in rural Cameroon.' },
  { id: 'e8', title: 'Carbon Footprint', category: 'Solutions', content: 'Everyday choices — transport, diet, energy use — add up; small shifts at scale meaningfully cut emissions.' },
  { id: 'e9', title: 'Sustainable Farming', category: 'Solutions', content: 'Crop rotation, agroforestry, and drought-resistant varieties help farmers adapt to shifting rainfall.' },
  { id: 'e10', title: 'Forest Protection', category: 'Action', content: 'The Congo Basin forests store carbon and regulate rainfall — protecting them protects the whole region\'s climate.' },
  { id: 'e11', title: 'Water Conservation', category: 'Action', content: 'Harvest rainwater, fix leaks, use efficient irrigation, and protect watersheds to adapt to changing rainfall.' },
  { id: 'e12', title: 'Biodiversity', category: 'Fundamentals', content: "Cameroon's forests and savannas host exceptional biodiversity, increasingly stressed by habitat loss and warming." },
  { id: 'e13', title: 'Disaster Preparedness', category: 'Action', content: 'Prepare emergency kits, know evacuation routes, monitor weather alerts, and report flooding through community channels.' },
  { id: 'e14', title: 'Northern Cameroon — Desertification', category: 'Cameroon Regions', content: 'The Far North and North regions face expanding desertification, reduced rainfall, water scarcity, and declining crop yields, alongside extreme heat and livestock challenges.' },
  { id: 'e15', title: 'Southern Cameroon — Flooding', category: 'Cameroon Regions', content: 'Heavy rainfall in the South and Southwest causes flooding, landslides, and forest degradation.' },
  { id: 'e16', title: 'Coastal Areas — Sea Level Rise', category: 'Cameroon Regions', content: 'Coastal erosion, saltwater intrusion, and risks to fishing communities affect Limbe, Kribi, and Douala.' },
  { id: 'e17', title: 'Yaoundé & Douala — Urban Flooding', category: 'Cameroon Regions', content: 'Poor drainage, rapid urbanization, and heat islands increase flood and air pollution risks in major cities.' },
];
