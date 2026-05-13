const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_STOREFRONT_ROOT_DOMAIN || "shopbotbd.com";

export function getStorefrontFromQuery(search?: string | null): string | null {
  const source =
    search ??
    (typeof window !== "undefined" ? window.location.search : null);

  if (!source) return null;

  const params = new URLSearchParams(source);
  const store = params.get("store")?.trim().toLowerCase();

  return store || null;
}

export function getStorefrontSubdomain(
  hostname?: string | null,
  search?: string | null,
): string | null {
  const queryStore = getStorefrontFromQuery(search);
  if (queryStore) return queryStore;

  const host =
    hostname ||
    (typeof window !== "undefined" ? window.location.hostname : null);

  if (!host) return null;

  const normalized = host.toLowerCase();
  if (normalized === "localhost" || normalized.endsWith(".localhost")) {
    const parts = normalized.split(".");
    return parts.length > 1 ? parts[0] : null;
  }

  if (!normalized.endsWith(ROOT_DOMAIN.toLowerCase())) {
    return null;
  }

  const suffix = `.${ROOT_DOMAIN.toLowerCase()}`;
  if (!normalized.endsWith(suffix)) {
    return null;
  }

  return normalized.slice(0, normalized.length - suffix.length) || null;
}

export function isStorefrontHost(hostname?: string | null): boolean {
  return Boolean(getStorefrontSubdomain(hostname));
}

export function withStorefrontQuery(path: string, search?: string | null): string {
  const store = getStorefrontSubdomain(undefined, search);
  if (!store) return path;

  const [pathname, hash = ""] = path.split("#", 2);
  const separator = pathname.includes("?") ? "&" : "?";

  return `${pathname}${separator}store=${encodeURIComponent(store)}${
    hash ? `#${hash}` : ""
  }`;
}

export function getStorefrontCartKey(baseKey = "shopbot_storefront_cart"): string {
  const store = getStorefrontSubdomain();
  return store ? `${baseKey}:${store}` : baseKey;
}
