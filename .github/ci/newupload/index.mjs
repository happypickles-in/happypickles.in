import * as github from "@actions/github";
import * as core from '@actions/core';
import {S3Client,DeleteObjectCommand} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import Cloudflare from "cloudflare";
import {brotliParamsForMime} from "./brotli.mjs";
import {readdirSync} from "node:fs";
const context = github.context;
console.log(context);
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
const files = readdirSync("./dist/");
console.log(files);