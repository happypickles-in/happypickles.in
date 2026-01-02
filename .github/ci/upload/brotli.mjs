import { createReadStream, statSync } from "node:fs";
import { lookup } from "mime-types";
import { createBrotliCompress, constants } from "node:zlib";

const BROTLI_TEXT_MIME = new Set([
  "text/html",
  "application/xhtml+xml",
  "application/xml",
  "text/xml",
  "image/svg+xml",
  "text/css",
  "application/javascript",
  "text/javascript",
  "application/x-javascript",
  "text/js",
  "application/json",
  "application/ld+json",
  "text/plain",
  "text/csv",
  "text/tab-separated-values",
  "application/rss+xml",
  "application/atom+xml",
  "text/x-component",
  "text/richtext",
  "text/x-java-source",
  "text/x-script",
  "application/x-httpd-cgi",
  "application/x-perl"
]);

const BROTLI_BINARY_MIME = new Set([
  "application/font",
  "application/font-sfnt",
  "application/opentype",
  "application/otf",
  "application/truetype",
  "application/ttf",
  "application/vnd.ms-fontobject",
  "font/eot",
  "font/opentype",
  "font/otf",
  "font/ttf",
  "application/wasm",
  "application/vnd.apple.mpegurl",
  "application/x-mpegurl",
  "application/vnd.mapbox-vector-tile",
  "application/pdf",
  "application/protobuf",
  "application/pkcs7-mime"
]);

export function brotliParamsForMime(file) {
  const mime = (lookup(file) || "application/octet-stream").toLowerCase();

  const size = statSync(file).size;
  const stream = createReadStream(file);

  if (BROTLI_TEXT_MIME.has(mime)) {
    return {
      Body: stream.pipe(
        createBrotliCompress({
          params: {
            [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
            [constants.BROTLI_PARAM_QUALITY]: 11,
            [constants.BROTLI_PARAM_SIZE_HINT]: size
          }
        })
      ),
      ContentType: mime,
      ContentEncoding: "br"
    };
  }

  if (BROTLI_BINARY_MIME.has(mime)) {
    return {
      Body: stream.pipe(
        createBrotliCompress({
          params: {
            [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_GENERIC,
            [constants.BROTLI_PARAM_QUALITY]: 11,
            [constants.BROTLI_PARAM_SIZE_HINT]: size
          }
        })
      ),
      ContentType: mime,
      ContentEncoding: "br"
    };
  }

  // no compression
  return {
    Body: stream,
    ContentType: mime
  };
}
