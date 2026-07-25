import axios from 'axios';
import https from 'https';
import fetch from 'node-fetch';

const BASE_URL = "https://hub.ytconvert.org/api/download";
const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Origin": "https://media.ytmp3.gg",
  "Referer": "https://media.ytmp3.gg/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function extractVideoId(url: string) {
  try {
    const u = new URL(url);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    if (u.hostname.includes("youtu.be")) return u.pathname.split("/")[1];
    if (u.pathname.includes("/shorts/")) return u.pathname.split("/shorts/")[1];
    
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) return ytMatch[1];
    
    return null;
  } catch {
    return null;
  }
}

async function requestConvert(payload: any) {
  const res = await axios.post(BASE_URL, payload, { headers });
  return res.data;
}

async function waitUntilReady(statusUrl: string) {
  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    try {
      const { data } = await axios.get(statusUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 2500
      });
      if (data.status === "completed" || data.downloadUrl) return data;
      if (data.status === "error") throw new Error("API merespon status error.");
    } catch (e: any) {
      if (e.message?.includes("status error")) throw e;
    }
    await delay(800);
    attempts++;
  }
  throw new Error("Timeout: Menunggu konversi terlalu lama.");
}

async function primaryMP3(url: string) {
  const convert = await requestConvert({
    url,
    os: "windows",
    output: { type: "audio", format: "mp3" }
  });
  const status = await waitUntilReady(convert.statusUrl);
  return {
    title: convert.title,
    downloadUrl: status.downloadUrl
  };
}

async function primaryMP4(url: string, quality = "720") {
  const convert = await requestConvert({
    url,
    os: "windows",
    output: { type: "video", format: "mp4", quality: quality + "p" }
  });
  const status = await waitUntilReady(convert.statusUrl);
  return {
    title: convert.title,
    downloadUrl: status.downloadUrl
  };
}

async function secondaryDownload(url: string, type = "mp3", format = "128") {
  const params = type === "mp3" ? { format: "mp3", audio_quality: format, url } : { format, url };
  const { data } = await axios.get("https://p.lbserver.xyz/ajax/download.php", { params, timeout: 3000 });

  if (!data?.progress_url) throw new Error("Progress URL tidak ditemukan.");

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const poll = async () => {
      try {
        if (attempts > 5) return reject(new Error("Secondary timeout"));
        attempts++;
        const { data: res } = await axios.get(data.progress_url, { timeout: 2500 });
        if (res.progress >= 1000) {
          resolve({
            title: data.title,
            downloadUrl: res.download_url
          });
        } else setTimeout(poll, 800);
      } catch (e) {
        setTimeout(poll, 800);
      }
    };
    poll();
  });
}

const SaveNow = {
  api: "https://p.savenow.to",
  key: "dfcb6d76f2f6a9894gjkege8a4ab232222",
  agent: new https.Agent({ rejectUnauthorized: false })
};

async function tertiaryDownload(url: string, type = "mp3") {
  const format = type === "mp3" ? "mp3" : "720";
  const { data } = await axios.get(`${SaveNow.api}/ajax/download.php`, {
    params: { format, url, api: SaveNow.key },
    httpsAgent: SaveNow.agent,
    timeout: 3000
  });

  for (let i = 0; i < 5; i++) {
    try {
      const { data: res } = await axios.get(data.progress_url, { httpsAgent: SaveNow.agent, timeout: 2500 });
      if (res.success && res.download_url) {
        return {
          title: data.info?.title,
          downloadUrl: res.download_url
        };
      }
    } catch {}
    await delay(800);
  }
  throw new Error("Timeout: SaveNow terlalu lama merespon.");
}

const SS_HEADERS = {
  'User-Agent': 'Mozilla/5.0',
  'Content-Type': 'application/x-www-form-urlencoded',
  'origin': 'https://ssyou.online',
  'referer': 'https://ssyou.online/en12/'
};

async function quaternaryDownload(url: string, type = "mp3") {
  if (type !== "mp3") throw new Error("SSYoutube only supports MP3 extraction fallback");
  
  const r = await fetch("https://ssyou.online/yt-video-detail/", {
    method: "POST",
    headers: SS_HEADERS as any,
    body: new URLSearchParams({ videoURL: url })
  });

  const html = await r.text();
  const title = (html.match(/videoTitle[^>]*>(.*?)</) || [])[1] || "Unknown";

  const req = await fetch("https://ssyou.online/wp-admin/admin-ajax.php", {
    method: "POST",
    headers: SS_HEADERS as any,
    body: new URLSearchParams({ action: "get_mp3_conversion_url", videoUrl: url })
  });
  const json = await req.json() as any;
  return { title, downloadUrl: json.data.url };
}

export async function ytmp3(url: string) {
  try {
    return await primaryMP3(url);
  } catch (e1) {
    try {
      return await secondaryDownload(url, "mp3") as any;
    } catch (e2) {
      try {
        return await tertiaryDownload(url, "mp3");
      } catch (e3) {
        try {
          return await quaternaryDownload(url, "mp3");
        } catch (e4) {
          throw new Error("Semua server gagal memproses Audio.");
        }
      }
    }
  }
}

export async function ytmp4(url: string, quality = "720") {
  try {
    return await primaryMP4(url, quality);
  } catch (e1) {
    try {
      return await secondaryDownload(url, "mp4", quality) as any;
    } catch (e2) {
      try {
        return await tertiaryDownload(url, "mp4");
      } catch (e3) {
        throw new Error("Semua server gagal memproses Video.");
      }
    }
  }
}
