import * as github from "@actions/github";
import * as core from '@actions/core';
import {S3Client} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import { lookup } from "mime-types";
import Cloudflare from "cloudflare";
import {createReadStream} from "node:fs";

const context = github.context;

const octokit = github.getOctokit(process.env["GITHUB_TOKEN"]);

const changes = process.env['GIT_CHANGES'] || "";

console.log(changes);
/**
const cloudflare  = new Cloudflare({
  apiToken: process.env['CLOUDFLARE_API_TOKEN']
});

const s3 = new S3Client({ 
  region: process.env["AWS_REGION"],
  credentials: {
    accessKeyId: process.env["AWS_ACCESS_KEY_ID"],
    secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
    sessionToken: process.env["AWS_SESSION_TOKEN"]
  }
});

const upload_list = [];
const files = [];
upload_list.push(new Upload({
  client:s3,
  params: {
    Bucket:process.env["S3_BUCKET_NAME"],
    Key:"LICENSE",
    Body:createReadStream("./../../../LICENSE"),
    ContentType:"text/plain"
  }
}).done());

const cache = await cloudflare.cache.purge(
  { 
    "zone_id":process.env["CLOUDFLARE_ZONE_ID"],
    "files": [
      "http://happypickles.in/LICENSE"
    ]
  }
);

await Promise.all(upload_list);
*/

console.log("Finished upload process.");