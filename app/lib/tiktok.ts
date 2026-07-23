declare global {
  interface Window {
    ttq?: {
      [key: string]: any;
      methods?: string[];
      setAndDefer?: (target: any, methodName: string) => void;
      load?: (pixelId: string) => void;
      page?: (...args: any[]) => void;
      track?: (eventName: string, params?: Record<string, unknown>) => void;
      ready?: (callback: () => void) => void;
    };
    TiktokAnalyticsObject?: string;
  }
}

const getPixelId = () =>
  process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || process.env.TIKTOK_PIXEL_ID || "";

export const initTikTokPixel = () => {
  if (typeof window === "undefined") return;

  const pixelId = getPixelId();
  if (!pixelId || window.ttq) return;

  const snippet = `
    !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
    ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
    ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
    for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
    ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a&&a.parentNode&&a.parentNode.insertBefore(o,a)};
    ttq.load("${pixelId}");
    ttq.page();
    }(window, document, "ttq");
  `;

  const script = document.createElement("script");
  script.innerHTML = snippet;
  document.head.appendChild(script);
};

export const trackTikTokEvent = async (
  eventName: string,
  params: Record<string, unknown> = {}
) => {
  if (typeof window === "undefined") return;

  const pixelId = getPixelId();
  if (!pixelId) return;

  if (window.ttq?.track) {
    window.ttq.track(eventName, params);
  }

  try {
    await fetch("/api/tiktok/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        pixelId,
        params,
        url: window.location.href,
        referrer: document.referrer,
      }),
    });
  } catch (error) {
    console.error("TikTok event forwarding failed:", error);
  }
};
