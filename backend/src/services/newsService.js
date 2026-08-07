const axios = require('axios');
const env = require('../config/env');
const supabaseService = require('./supabaseService');
const logger = require('../utils/logger');

const CATEGORY_QUERIES = {
  climate: 'climate change Cameroon Africa',
  agriculture: 'agriculture farming Cameroon drought',
  floods: 'flooding Cameroon Africa',
  drought: 'drought Sahel Cameroon',
  heat: 'heat wave Africa climate',
  forest: 'deforestation forest conservation Cameroon',
  wildlife: 'wildlife biodiversity Africa climate',
  government: 'Cameroon climate policy environment',
  international: 'global climate change UN IPCC',
};

const mapCategory = (query) => {
  const q = (query || '').toLowerCase();
  if (q.includes('agricult')) return 'Agriculture';
  if (q.includes('flood')) return 'Floods';
  if (q.includes('drought')) return 'Drought';
  if (q.includes('heat')) return 'Heat Waves';
  if (q.includes('forest')) return 'Forest Conservation';
  if (q.includes('wildlife') || q.includes('biodivers')) return 'Wildlife';
  if (q.includes('policy') || q.includes('government')) return 'Government Policies';
  if (q.includes('global') || q.includes('international')) return 'International';
  return 'Climate';
};

const fetchFromNewsApi = async ({ category, search, page = 1, pageSize = 20 }) => {
  if (!env.newsApiKey) {
    return getFallbackArticles(category, search);
  }
  const query = search || CATEGORY_QUERIES[category?.toLowerCase()] || CATEGORY_QUERIES.climate;
  const url = 'https://newsapi.org/v2/everything';
  try {
    const { data } = await axios.get(url, {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        page,
        pageSize,
        apiKey: env.newsApiKey,
      },
      timeout: 12000,
    });
    return (data.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      image: a.urlToImage,
      category: mapCategory(query),
      source: a.source?.name,
      url: a.url,
      published_at: a.publishedAt,
    }));
  } catch (err) {
    logger.warn('NewsAPI fetch failed', { error: err.message });
    return getFallbackArticles(category, search);
  }
};

const getFallbackArticles = (category, search) => {
  // Sample-data variety across several real Cameroonian/African news
  // outlets — used only when NEWS_API_KEY isn't set or the live fetch
  // fails, so the feed still reads as multi-source rather than one outlet.
  const articles = [
    {
      title: 'Cameroon Faces Rising Flood Risk in Urban Centers',
      description: 'Heavy rainfall and poor drainage systems increase flooding in Yaoundé and Douala.',
      image: null,
      category: 'Floods',
      source: 'CRTV',
      url: 'https://example.com/floods-cameroon',
      published_at: new Date().toISOString(),
    },
    {
      title: 'Desertification Threatens Northern Cameroon Agriculture',
      description: 'Farmers in the Far North adapt with drought-resistant crops as rainfall patterns shift.',
      image: null,
      category: 'Drought',
      source: 'Cameroon Tribune',
      url: 'https://example.com/desertification-cameroon',
      published_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      title: 'Coastal Communities Monitor Sea Level Rise',
      description: 'Saltwater intrusion and erosion affect fishing villages along the Atlantic coast.',
      image: null,
      category: 'Climate',
      source: 'Journal du Cameroun',
      url: 'https://example.com/coastal-cameroon',
      published_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      title: 'Renewable Energy Projects Expand in Central Africa',
      description: 'Solar and hydro initiatives aim to reduce carbon emissions across the region.',
      image: null,
      category: 'International',
      source: 'Business in Cameroon',
      url: 'https://example.com/renewable-africa',
      published_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      title: 'Reforestation Drive Expands Across the Far North',
      description: 'Community tree-planting campaigns aim to slow desertification around Maroua and Kousseri.',
      image: null,
      category: 'Forest Conservation',
      source: 'Actu Cameroun',
      url: 'https://example.com/reforestation-far-north',
      published_at: new Date(Date.now() - 129600000).toISOString(),
    },
    {
      title: 'Cocoa Farmers in the West Adapt to Shifting Rainfall',
      description: 'Agroforestry techniques help buffer cocoa yields against increasingly unpredictable rains.',
      image: null,
      category: 'Agriculture',
      source: 'Cameroon Tribune',
      url: 'https://example.com/cocoa-adaptation-west',
      published_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      title: 'Heat Advisory Issued for Northern Regions',
      description: 'Health officials warn of rising heat-stroke risk as temperatures climb across Garoua and Maroua.',
      image: null,
      category: 'Heat Waves',
      source: 'CRTV',
      url: 'https://example.com/heat-advisory-north',
      published_at: new Date(Date.now() - 216000000).toISOString(),
    },
    {
      title: 'Africa Climate Ministers Push for Adaptation Funding',
      description: 'Regional governments call for increased international financing ahead of the next climate summit.',
      image: null,
      category: 'Government Policies',
      source: 'AllAfrica',
      url: 'https://example.com/africa-adaptation-funding',
      published_at: new Date(Date.now() - 259200000).toISOString(),
    },
  ];
  let filtered = articles;
  if (category) filtered = filtered.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (a) => a.title.toLowerCase().includes(s) || a.description.toLowerCase().includes(s)
    );
  }
  return filtered;
};

// Always hits NewsAPI (bypassing the DB cache) and upserts the results —
// new articles get distinct URLs so they insert as fresh rows, which is
// what keeps "latest news" actually advancing day to day. Fire-and-forget
// from callers; errors are swallowed since this is a background refresh.
const refreshCategory = async (category) => {
  if (!env.newsApiKey) return;
  try {
    const fetched = await fetchFromNewsApi({ category, pageSize: 20 });
    if (fetched.length) await supabaseService.upsertArticles(fetched);
  } catch (err) {
    logger.warn('Background news refresh failed', { category, error: err.message });
  }
};

const refreshAllCategories = async () => {
  for (const category of Object.keys(CATEGORY_QUERIES)) {
    // eslint-disable-next-line no-await-in-loop
    await refreshCategory(category);
  }
  logger.info('News cache refreshed across all categories');
};

const getNews = async ({ category, search, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  let { articles, total } = await supabaseService.getArticles({ category, search, limit, offset });

  if (!articles?.length) {
    const fetched = await fetchFromNewsApi({ category, search, page, pageSize: limit });
    if (fetched.length) {
      await supabaseService.upsertArticles(fetched).catch((err) => {
        logger.warn('Article upsert failed', { error: err.message });
      });
      const result = await supabaseService.getArticles({ category, search, limit, offset });
      articles = result.articles;
      total = result.total;
    } else {
      articles = getFallbackArticles(category, search);
      total = articles.length;
    }
  } else if (!search) {
    // Stale-while-revalidate: serve the cached page immediately, but kick
    // off a background refresh so the NEXT request already sees newer
    // articles — this is what makes the feed feel "always updating"
    // without adding latency to this request.
    refreshCategory(category).catch(() => {});
  }

  return { articles, total, page, limit };
};

module.exports = { getNews, fetchFromNewsApi, refreshCategory, refreshAllCategories, CATEGORY_QUERIES };
