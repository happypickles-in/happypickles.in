import * as github from "@actions/github";
import * as core from '@actions/core';
import {S3Client,DeleteObjectCommand} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import Cloudflare from "cloudflare";
import {brotliParamsForMime} from "./brotli.mjs";
const context = github.context;
const octokit = github.getOctokit(process.env["GITHUB_TOKEN"]);
const bucket = process.env["S3_BUCKET_NAME"];
const domains = process.env["SITE_DOMAINS"].split(",");
const s3 = new S3Client({
    region: process.env["AWS_REGION"],
    credentials: {
        accessKeyId: process.env["AWS_ACCESS_KEY_ID"],
        secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
        sessionToken: process.env["AWS_SESSION_TOKEN"]
    }
});
let deletes = process.env['GIT_DELETES'] || "";
let cache_list = [];
let s3_deletes = [];
for (let file of deletes.split("\n")) {
    file = file.trim();
    if (file.length === 0) {
        continue;
    }
    for (let domain of domains) {
        domain = domain.trim();
        if (domain.length === 0) {
            continue;
        }
        cache_list.push(`https://${domain}/${file}`);
    }
    s3_deletes.push(s3.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: file
    })));
};
deletes = null;
await Promise.all(s3_deletes);
s3_deletes = null;
let uploads = process.env['GIT_PUTS'] || "";
let s3_puts = [];
for (let file of uploads.split("\n")) {
    file = file.trim();
    if (file.trim().length === 0) {
        continue;
    }
    if (file.startsWith(".github/") || file.startsWith("README.md") || file.startsWith("LICENSE") || file.startsWith(".gitignore")) {
        continue;
    }
    for (let domain of domains) {
        domain = domain.trim();
        if (domain.length === 0) {
            continue;
        }
        cache_list.push(`https://${domain}/${file}`);
    }
    s3_puts.push(new Upload({
        client: s3,
        params: {
            Bucket: bucket,
            Key: file,
            ...brotliParamsForMime(file),
        }
    }).done());
}
uploads = null;
await Promise.all(s3_puts);
s3_puts = null;
let cloudflare = new Cloudflare({
    apiToken: process.env['CLOUDFLARE_API_TOKEN']
});
let cache = await cloudflare.cache.purge({
    "zone_id": process.env["CLOUDFLARE_ZONE_ID"],
    "files": cache_list
});

cloudflare = null;
cache = null;
core.info(`Purged ${cache_list.length} files from Cloudflare cache.`);
cache_list = null;
