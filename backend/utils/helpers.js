const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Hash string
const hashString = (string) => {
  return crypto.createHash('sha256').update(string).digest('hex');
};

// Format date
const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

// Calculate engagement rate
const calculateEngagementRate = (engagements, impressions) => {
  if (!impressions || impressions === 0) return 0;
  return ((engagements / impressions) * 100).toFixed(2);
};

// Truncate text
const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Slugify string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Parse hashtags from text
const extractHashtags = (text) => {
  const hashtagRegex = /#\w+/g;
  return text.match(hashtagRegex) || [];
};

// Calculate word count
const wordCount = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Generate unique ID
const generateId = () => {
  return crypto.randomUUID();
};

// Deep clone object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Sleep function for delays
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Format number with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Calculate percentage change
const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};

// Group array by key
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    result[group] = result[group] || [];
    result[group].push(item);
    return result;
  }, {});
};

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

module.exports = {
  generateRandomString,
  hashString,
  formatDate,
  calculateEngagementRate,
  truncateText,
  slugify,
  extractHashtags,
  wordCount,
  generateId,
  deepClone,
  sleep,
  formatNumber,
  calculatePercentageChange,
  groupBy,
  debounce,
  throttle,
};