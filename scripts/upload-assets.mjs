// scripts/upload-assets.mjs
// Uploads all images in a folder to Supabase Storage + inserts gobeauty_looks rows.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/upload-assets.mjs \
//     --source ~/Downloads/gobeauty-assets \
//     --bucket gobeauty-look-images \
//     --creator lover009 \
//     --tag-bucket "从 Google Drive 抓的素材"
//
// Idempotent: skips files that already exist (by storage path)

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import { extname, basename } from 'path';
import mime from 'mime-types';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

function arg(name, def) {
  const i = process.argv.indexOf(name);
  if (i === -1) return def;
  return process.argv[i + 1] || def;
}

const SOURCE = arg('--source', process.cwd());
const BUCKET = arg('--bucket', 'gobeauty-look-images');
const CREATOR = arg('--creator', 'lover009');
const TAG_BUCKET = arg('--tag-bucket', 'imported');
const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT = parseInt(arg('--limit', '0'), 10);

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.gif']);

async function findImages(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('.')) continue;
      await findImages(p, acc);
    } else if (e.isFile() && IMAGE_EXTS.has(extname(e.name).toLowerCase())) {
      acc.push(p);
    }
  }
  return acc;
}

async function getCreatorId(username) {
  const { data, error } = await sb.from('gobeauty_users').select('id').eq('username', username).single();
  if (error) throw new Error(`creator ${username} not found: ${error.message}`);
  return data.id;
}

async function alreadyUploaded(storagePath) {
  const { data } = await sb.storage.from(BUCKET).list(path.dirname(storagePath), {
    search: path.basename(storagePath),
  });
  return data && data.some((f) => f.name === path.basename(storagePath));
}

async function existingLookByUrl(imageUrl) {
  const { data } = await sb
    .from('gobeauty_looks')
    .select('id, image_url, title')
    .eq('image_url', imageUrl)
    .maybeSingle();
  return data || null;
}

function humanTitle(filename) {
  return basename(filename, extname(filename))
    .replace(/^[a-z0-9]{8,}_/i, '') // strip uuid prefix
    .replace(/[_.-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function inferTags(filename, dirName) {
  const tags = [TAG_BUCKET];
  const lower = (filename + ' ' + dirName).toLowerCase();
  if (lower.match(/nail|polish|manicure/)) tags.push('nails');
  if (lower.match(/salon|studio|spa/)) tags.push('salon');
  if (lower.match(/face|makeup|skincare|glow/)) tags.push('skincare');
  if (lower.match(/hair|braid|curl/)) tags.push('hair');
  if (lower.match(/cherry|burgundy|red|wine/)) tags.push('red');
  if (lower.match(/pink|rose/)) tags.push('pink');
  if (lower.match(/nude|beige/)) tags.push('nude');
  if (lower.match(/black/)) tags.push('black');
  if (lower.match(/white|french/)) tags.push('french');
  if (lower.match(/floral|flower/)) tags.push('floral');
  if (lower.match(/3d/)) tags.push('3d');
  if (lower.match(/summer|beach/)) tags.push('summer');
  if (lower.match(/winter|snow/)) tags.push('winter');
  return [...new Set(tags)];
}

async function main() {
  const creatorId = await getCreatorId(CREATOR);
  console.log(`creator @${CREATOR} = ${creatorId}`);
  console.log(`scanning ${SOURCE}…`);

  const all = await findImages(SOURCE);
  const files = LIMIT > 0 ? all.slice(0, LIMIT) : all;
  console.log(`found ${all.length} images, processing ${files.length}${DRY_RUN ? ' (DRY RUN)' : ''}`);

  let uploaded = 0, skipped = 0, errored = 0;
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const rel = path.relative(SOURCE, f);
    const ext = extname(f).toLowerCase();
    const base = basename(f, ext);
    const safeName = base.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `looks/${CREATOR}/${Date.now()}_${safeName}${ext}`;
    const imageUrl = `/storage/v1/object/public/${BUCKET}/${storagePath}`;

    process.stdout.write(`[${i + 1}/${files.length}] ${rel}…`);

    if (DRY_RUN) {
      console.log(' (dry)');
      continue;
    }

    try {
      // 1) check if already uploaded
      const existing = await existingLookByUrl(imageUrl);
      if (existing) {
        console.log(` exists ✓`);
        skipped++;
        continue;
      }

      // 2) upload to storage
      const buf = await readFile(f);
      const contentType = mime.lookup(ext) || 'application/octet-stream';
      const { error: upErr } = await sb.storage.from(BUCKET).upload(storagePath, buf, {
        contentType,
        upsert: false,
      });
      if (upErr) throw new Error(`upload: ${upErr.message}`);

      // 3) insert DB row
      const tags = inferTags(basename(f), path.dirname(rel));
      const { error: insErr } = await sb.from('gobeauty_looks').insert({
        creator_id: creatorId,
        image_url: imageUrl,
        title: humanTitle(basename(f)),
        tags,
        origin: 'imported',
        origin_meta: {
          source: TAG_BUCKET,
          source_filename: path.basename(f),
          source_path: rel,
          mime_type: contentType,
          byte_size: buf.length,
          imported_at: new Date().toISOString(),
        },
      });
      if (insErr) throw new Error(`db: ${insErr.message}`);

      console.log(` ✓`);
      uploaded++;
    } catch (e) {
      console.log(` ✗ ${e.message}`);
      errors.push({ file: rel, error: e.message });
      errored++;
    }

    if ((i + 1) % 50 === 0) {
      console.log(`--- progress: uploaded=${uploaded} skipped=${skipped} errored=${errored} ---`);
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`uploaded: ${uploaded}`);
  console.log(`skipped (existing): ${skipped}`);
  console.log(`errored: ${errored}`);
  if (errors.length > 0) {
    console.log(`\nFirst 5 errors:`);
    for (const e of errors.slice(0, 5)) console.log(`  ${e.file}: ${e.error}`);
  }
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
