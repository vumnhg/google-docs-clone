type MicrolinkResponse = {
  status: "success" | "error";
  data: {
    title?: string;
    description?: string;
    image?: { url?: string };
    url?: string;
  };
};

export async function fetchLinkPreview(url: string): Promise<{
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}> {
  const res = await fetch(
    `https://api.microlink.io/?url=${encodeURIComponent(url)}`
  );
  const data = (await res.json()) as MicrolinkResponse;

  if (data.status !== "success") throw new Error("Preview failed");

  return {
    title: data.data.title,
    description: data.data.description,
    image: data.data.image?.url,
    url: data.data.url,
  };
}
