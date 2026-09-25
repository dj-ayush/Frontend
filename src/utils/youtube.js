export function getYouTubeId(url) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.replace('/', '');
    }

    if (parsedUrl.searchParams.has('v')) {
      return parsedUrl.searchParams.get('v');
    }

    const embedMatch = parsedUrl.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    return embedMatch?.[2] ?? '';
  } catch {
    return '';
  }
}

export function getYouTubeThumbnailSet(url) {
  const id = getYouTubeId(url);

  return {
    id,
    maxres: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    hq: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}
