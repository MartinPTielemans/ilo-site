import { useEffect } from "react";

// Each part rises once as it comes into view, the parts arriving together one after another. The hero
// is left alone, so the first screen is there at once, and the classes are only added here, so
// without script nothing is hidden. Only parts whose class React never changes are listed.
const PARTS = [
  ".say-bar h2",
  ".say-bar p",
  ".bar .cmd",
  ".try",
  ".habits h2",
  ".shot",
  ".moves li",
  ".figures h2",
  ".tile",
  ".letter h2",
  ".letter-body > *",
  ".get-line",
  ".close .get",
  ".foot .mark",
];

export function useEntrances() {
  useEffect(() => {
    const enter = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const part = entry.target as HTMLElement;
          // A long arrival reads as a page still loading, so the sixth part on comes with the fifth.
          part.style.setProperty("--i", String(Math.min(order++, 5)));
          part.classList.add("in");
          enter.unobserve(part);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const part of document.querySelectorAll(PARTS.join(","))) {
      part.classList.add("rise");
      enter.observe(part);
    }
    return () => enter.disconnect();
  }, []);
}
