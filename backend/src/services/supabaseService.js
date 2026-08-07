const { supabaseAdmin } = require('../config/supabase');

// ---- Users -----------------------------------------------------------
const createUserProfile = async ({ id, fullname, email, phone, region, district }) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([{ id, fullname, email, phone, region, district }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

const getUserProfile = async (id) => {
  const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

const updateUserProfile = async (id, updates) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ---- Articles & Bookmarks --------------------------------------------
const upsertArticles = async (articles) => {
  if (!articles.length) return [];
  const { data, error } = await supabaseAdmin
    .from('articles')
    .upsert(articles, { onConflict: 'url', ignoreDuplicates: false })
    .select();
  if (error) throw error;
  return data;
};

const getArticles = async ({ category, search, limit = 20, offset = 0 }) => {
  let query = supabaseAdmin
    .from('articles')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq('category', category);
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) throw error;
  return { articles: data, total: count };
};

const getArticleById = async (id) => {
  const { data, error } = await supabaseAdmin.from('articles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

const addBookmark = async (userId, articleId) => {
  const { data, error } = await supabaseAdmin
    .from('bookmarks')
    .insert([{ user_id: userId, article_id: articleId }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

const removeBookmark = async (userId, articleId) => {
  const { error } = await supabaseAdmin
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('article_id', articleId);
  if (error) throw error;
};

const getUserBookmarks = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('bookmarks')
    .select('*, articles(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const isBookmarked = async (userId, articleId) => {
  const { data } = await supabaseAdmin
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('article_id', articleId)
    .maybeSingle();
  return !!data;
};

// ---- Weather Cache & History -----------------------------------------
const getWeatherCache = async (region) => {
  const { data } = await supabaseAdmin
    .from('weather_cache')
    .select('*')
    .eq('region', region)
    .maybeSingle();
  return data;
};

const upsertWeatherCache = async (payload) => {
  const { data, error } = await supabaseAdmin
    .from('weather_cache')
    .upsert(payload, { onConflict: 'region' })
    .select()
    .single();
  if (error) throw error;
  return data;
};

const insertWeatherHistory = async (rows) => {
  if (!rows.length) return [];
  const { data, error } = await supabaseAdmin.from('weather_history').insert(rows).select();
  if (error) throw error;
  return data;
};

const getWeatherHistory = async (region, days = 7) => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabaseAdmin
    .from('weather_history')
    .select('*')
    .eq('region', region)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: true });
  if (error) throw error;
  return data;
};

// ---- Education & Tips ------------------------------------------------
const getClimateTips = async (limit = 10) => {
  const { data, error } = await supabaseAdmin
    .from('climate_tips')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

const getRandomClimateTip = async () => {
  const tips = await getClimateTips(50);
  if (!tips.length) return null;
  return tips[Math.floor(Math.random() * tips.length)];
};

const getEducationalContent = async ({ category, limit = 50 }) => {
  let query = supabaseAdmin
    .from('educational_content')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const getEducationalContentById = async (id) => {
  const { data, error } = await supabaseAdmin
    .from('educational_content')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

const getClimateInitiatives = async () => {
  const { data, error } = await supabaseAdmin
    .from('climate_initiatives')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const getDiseaseInformation = async () => {
  const { data, error } = await supabaseAdmin.from('disease_information').select('*');
  if (error) throw error;
  return data;
};

const getDiseaseById = async (id) => {
  const { data, error } = await supabaseAdmin
    .from('disease_information')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// ---- Flood Reports ---------------------------------------------------
const createFloodReport = async (payload) => {
  const { data, error } = await supabaseAdmin
    .from('flood_reports')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
};

const getFloodReports = async ({ status, region, userId, verifiedOnly = false }) => {
  let query = supabaseAdmin
    .from('flood_reports')
    .select('*, users(fullname, email)')
    .order('created_at', { ascending: false });

  if (verifiedOnly) query = query.eq('status', 'Verified');
  else if (status) query = query.eq('status', status);
  if (region) query = query.eq('region', region);
  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const getFloodReportById = async (id) => {
  const { data, error } = await supabaseAdmin
    .from('flood_reports')
    .select('*, users(fullname, email)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

const updateFloodReport = async (id, updates) => {
  const { data, error } = await supabaseAdmin
    .from('flood_reports')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const deleteFloodReport = async (id) => {
  const { error } = await supabaseAdmin.from('flood_reports').delete().eq('id', id);
  if (error) throw error;
};

// ---- Flood Report Images (Supabase Storage) ---------------------------
const FLOOD_IMAGES_BUCKET = 'flood-reports';

// Idempotent — safe to call on every server start. Creates the public
// bucket flood report photos live in if it doesn't exist yet.
const ensureFloodImagesBucket = async () => {
  const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
  if (error) throw error;
  if (buckets?.some((b) => b.name === FLOOD_IMAGES_BUCKET)) return;
  const { error: createError } = await supabaseAdmin.storage.createBucket(FLOOD_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: '5MB',
  });
  if (createError) throw createError;
};

const uploadFloodReportImage = async (path, buffer, contentType) => {
  const { error } = await supabaseAdmin.storage
    .from(FLOOD_IMAGES_BUCKET)
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw error;
  const { data } = supabaseAdmin.storage.from(FLOOD_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

// ---- Notifications ---------------------------------------------------
const getNotifications = async (userId, { unreadOnly = false, limit = 50 } = {}) => {
  let query = supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (unreadOnly) query = query.eq('read', false);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const createNotification = async ({ userId, title, message, type = 'general', region }) => {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .insert([{ user_id: userId, title, message, type, region }])
    .select()
    .single();
  if (!error) return data;

  // `type`/`region` are new columns — if this project's notifications
  // table hasn't been migrated yet, fall back to the original insert
  // shape rather than breaking notification creation entirely.
  const retry = await supabaseAdmin
    .from('notifications')
    .insert([{ user_id: userId, title, message }])
    .select()
    .single();
  if (retry.error) throw retry.error;
  return retry.data;
};

// Users with a known region — the audience for the daily regional
// climate-tip push notification job.
const getUsersForDailyTips = async () => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, fullname, region, push_token')
    .not('region', 'is', null);
  if (!error) return data;

  // `push_token` is a new column — fall back to a query without it so
  // in-app daily tips still go out (push sending is simply skipped) even
  // before this project's users table is migrated.
  const retry = await supabaseAdmin.from('users').select('id, fullname, region').not('region', 'is', null);
  if (retry.error) throw retry.error;
  return retry.data.map((u) => ({ ...u, push_token: null }));
};

const markNotificationRead = async (userId, notificationId) => {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const markAllNotificationsRead = async (userId) => {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (error) throw error;
};

module.exports = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  upsertArticles,
  getArticles,
  getArticleById,
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  isBookmarked,
  getWeatherCache,
  upsertWeatherCache,
  insertWeatherHistory,
  getWeatherHistory,
  getClimateTips,
  getRandomClimateTip,
  getEducationalContent,
  getEducationalContentById,
  getDiseaseInformation,
  getDiseaseById,
  getClimateInitiatives,
  createFloodReport,
  getFloodReports,
  getFloodReportById,
  updateFloodReport,
  deleteFloodReport,
  ensureFloodImagesBucket,
  uploadFloodReportImage,
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  getUsersForDailyTips,
};
