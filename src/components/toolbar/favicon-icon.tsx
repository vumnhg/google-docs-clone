import { knownTLDs } from "@/constants";

type Props = {
  url: string;
  preview?: { title?: string; description?: string; image?: string };
};

function isValidDomain(domain: string): boolean {
  const validChars = /^[a-zA-Z0-9.-]+$/.test(domain);
  const hasDot = domain.includes(".");
  const notStartOrEndWithDot = !domain.startsWith(".") && !domain.endsWith(".");

  const tld = domain.split(".").pop()?.toLowerCase();
  const hasKnownTLD = !!tld && knownTLDs.includes(tld);

  return (
    validChars &&
    hasDot &&
    notStartOrEndWithDot &&
    hasKnownTLD &&
    domain.length >= 4
  );
}

export function FaviconIcon({ url, preview }: Props) {
  let domain = "";

  try {
    domain = new URL(url).hostname;
  } catch {
    return (
      <div className="w-5 h-5 flex items-center justify-center">
        <img src="/globe.svg" className="w-5 h-5" alt="globe" />
      </div>
    );
  }

  if (!isValidDomain(domain)) {
    return (
      <div className="w-5 h-5 flex items-center justify-center">
        <img src="/globe.svg" className="w-5 h-5" alt="globe" />
      </div>
    );
  }

  const shouldFallback =
    preview?.title?.trim().toLowerCase() === domain.toLowerCase() &&
    !preview?.image &&
    !preview?.description;

  if (shouldFallback) {
    return (
      <div className="w-5 h-5 flex items-center justify-center">
        <img src="/globe.svg" className="w-5 h-5" alt="globe" />
      </div>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
      className="w-5 h-5 object-contain align-middle inline-block"
      alt="favicon"
      onError={(e) => {
        e.currentTarget.src = "/globe.svg";
      }}
      loading="lazy"
      decoding="async"
    />
  );
}
