/**
 *
 * @param debut
 * @example 'Chapter 129; Episode 78[1]'  => { manga: 129, anime: 78 }
 * @returns { manga: number, anime: number }
 */
export const formatDebut = (
  debut: string
): {
  manga: number;
  anime: number | undefined;
} => {
  try {
    const [manga, anime] = debut.replace(/\[.*?\]/g, "").split(";");
    return {
      manga: Number(manga?.trim().split(" ")[1]),
      anime: anime ? Number(anime?.trim().split(" ")[1]) : undefined,
    };
  } catch (e) {
    console.log(e, debut);
    return {
      manga: 0,
      anime: 0,
    };
  }
};

/**
 *
 * @param affiliations
 * @example 'Shandia[1]; Wagomuland[3]' => ['Shandia', 'Wagomuland']
 * @returns string[]
 */
export const formatAffiliations = (affiliations?: string): string[] => {
  if (!affiliations) return [];
  return affiliations
    .replace(/\[.*?\]/g, "")
    .replace(/\(.*?\)/g, "")
    .split(";")
    .map((affiliation) => affiliation.trim());
};

/**
 *
 * @param origin
 * @example 'Sky Islands (Skypiea)[4]' => 'Sky Islands'
 * @returns
 */
export const formatOrigin = (origin?: string): string => {
  if (!origin) return "Unknown";
  return origin
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();
};

/**
 *
 * @param age string
 * @example '34 (debut)36 (after timeskip, at death)[5]' => 36
 * @returns number | 'unknown'
 */
export const formatAge = (age?: string): number | "unknown" => {
  if (!age) return "unknown";
  return Number(
    age
      .replace(/\(.*?\)/g, "")
      .replace(/\[.*?\]/g, "")
      .trim()
      .split(" ")
      .splice(-1, 1)
  );
};

/**
 *
 * @param height
 * @example '174 cm (5'8½")[5]' => 174
 * @returns number | 'unknown
 */
export const formatHeight = (height?: string): number | "unknown" => {
  if (!height) return "unknown";
  return Number(height.split(" ")[0]);
};

// TODO: add "Uknown" to the list
/**
 *
 * @param bounty
 * @example '1,659,000,000[8]80,000,000[9]' => 1659000000
 * @returns number | 'unknown'
 */
export const formatBounty = (bounty?: string): number | "unknown" => {
  if (!bounty) return "unknown";
  const lastBounty = bounty.split("[")[0];
  return Number(lastBounty.replace(/,/g, ""));
};

/**
 *
 * @param name
 * @example 'Gomu Gomu no Mi' => 'Gomu Gomu no Mi'
 * @returns
 */
export const formatDevilFruitName = (name?: string): string => {
  if (!name) return "unknown";
  return name
    .replace(/\[.*?\]/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();
};

// ********* SAGA *********

/**
 *
 * @param volumes
 * @example '1-12, 12 volumes' => { start: 1, end: 12 }
 * @returns
 */
export const formatVolumes = (
  volumes: string
): { start: number; end: number } => {
  const [start, end] = volumes
    .split(",")[0]
    .split("-")
    .map((volume) => Number(volume));
  return { start, end };
};

/**
 *
 * @param chapters
 * @example '1-100, 100 chapters' => { start: 1, end: 100 }
 * @returns
 */
export const formatChapters = (
  chapters: string
): { start: number; end: number } => {
  const [start, end] = chapters
    .split(",")[0]
    .split("-")
    .map((chapter) => Number(chapter));
  return { start, end };
};

// TODO: Handle 890-906 and 907-958 problem
/**
 *
 * @param episodes
 * @example '1-61, 61 episodes; (4kids dub' => { start: 1, end: 61 }
 * @returns
 */
export const formatEpisodes = (
  episodes: string
): { start: number; end: number } => {
  const [start, end] = episodes
    .split(",")[0]
    .split("-")
    .map((episode) => Number(episode));
  return { start, end };
};
