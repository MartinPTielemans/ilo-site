import { Fragment, useEffect, useState } from "react";
import { PLATFORMS, type Platform, downloadUrl, platformFor } from "../downloads";

/** The download for the visitor's computer, named for it, and with `others` the rest after it. */
export function Download({ className, others }: { className: string; others?: boolean }) {
  // The prerendered page offers the first platform; the visitor's own takes its place on load.
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0]);
  useEffect(() => setPlatform(platformFor(navigator.userAgent)), []);
  const rest = PLATFORMS.filter((other) => other !== platform);

  return (
    <>
      <a className={className} href={downloadUrl(platform)}>
        Download for {platform.name}
      </a>
      {others && (
        <p className="others">
          {platform.note}
          {rest.length > 0 && ". Also for "}
          {rest.map((other, index) => (
            <Fragment key={other.id}>
              {index === 0 ? "" : index === rest.length - 1 ? " and " : ", "}
              <a href={downloadUrl(other)}>{other.name}</a>
            </Fragment>
          ))}
          .
        </p>
      )}
    </>
  );
}
