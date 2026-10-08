export type PlatformType =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "twitter"
  | "pinterest";

export function createUrlRegex(domain: string | string[]): RegExp {
  const escape = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const domains = Array.isArray(domain)
    ? domain.map(escape).join("|")
    : escape(domain);

  return new RegExp(`^https?:\\/\\/([a-z0-9-]+\\.)?(${domains})\\/.+$`, "i");
}

const platformDomains: Record<PlatformType, string | string[]> = {
  tiktok: "tiktok.com",
  instagram: "instagram.com",
  youtube: ["youtube.com", "youtu.be"],
  twitter: ["twitter.com", "x.com"],
  pinterest: ["pinterest.com", "pin.it"],
};

export function isValidUrl(url: string, platform: PlatformType): boolean {
  const domains = platformDomains[platform];
  if (!domains) return false;
  return createUrlRegex(domains).test(url);
}
