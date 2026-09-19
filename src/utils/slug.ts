/**
 * Convert string (e.g. Home & Kitchen, Gaming Consoles, Electronics) into a clean URL-friendly slug.
 */
export const slugify = (text: string): string => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&+/g, "and")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Alternative basic slugify where '&' is simply stripped (e.g. 'home-kitchen' or 'electronics')
 */
export const simpleSlug = (text: string): string => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Check if a department or category's name matches a route slug.
 * Flexible enough to match 'electronics', 'home-kitchen', 'home-and-kitchen', etc.
 */
export const matchesSlug = (name: string, slug: string): boolean => {
  if (!name || !slug) return false;
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
  const normalizedName = name.toLowerCase().trim();

  // Direct match
  if (normalizedName === decodedSlug) return true;

  // Slugified matches
  if (slugify(name) === decodedSlug) return true;
  if (simpleSlug(name) === decodedSlug) return true;

  // Compare alphanumeric only
  const cleanName = normalizedName.replace(/[^a-z0-9]/g, "");
  const cleanSlug = decodedSlug.replace(/[^a-z0-9]/g, "");
  return cleanName === cleanSlug;
};
