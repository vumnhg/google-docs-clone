type MicrolinkResponse = {
  status: "success" | "error";
  data: {
    title?: string;
    description?: string;
    image?: { url?: string };
    url?: string;
  };
};

function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export async function fetchLinkPreview(url: string): Promise<{
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}> {
  if (!isValidUrl(url)) {
    return {
      title: "",
      description: "",
      image: "",
      url,
    };
  }

  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`
    );

    if (!res.ok) {
      console.warn("Microlink API error:", res.status);
      return {
        title: "",
        description: "",
        image: "",
        url,
      };
    }

    const data = (await res.json()) as MicrolinkResponse;

    if (data.status !== "success") {
      return {
        title: "",
        description: "",
        image: "",
        url,
      };
    }

    return {
      title: data.data.title ?? "",
      description: data.data.description ?? "",
      image: data.data.image?.url ?? "",
      url: data.data.url ?? url,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return {
      title: "",
      description: "",
      image: "",
      url,
    };
  }
}
