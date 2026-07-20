-- goBeauty: seed / upsert curated K-beauty brand catalog (~108 brands).
--
-- - Inserts missing brands into public.gb_brands
-- - Sets country = 'Korean' for all listed slugs (existing + new)
-- - Does NOT create products; brand detail pages show "No products decoded yet"
--   until skinsort/inci ingest lands catalog items.
--
-- Canonical public slugs live in data/kbeauty-brands.ts. Some legacy skinsort
-- slugs (a39pieu, axis---y, drg, …) already exist and are updated by name only.
-- New brands use clean slugs from the catalog.
--
-- Apply (tunnel):
--   psql "$RDS_DSN" -f db/rds/004_kbeauty_brands.sql
-- Or: python3 pipelines/gb_seed_kbeauty_brands.py

begin;

-- ── upsert helper: insert if missing, refresh country + name ─────────────────
-- (website left null unless we already have one; description optional)

insert into public.gb_brands (slug, name, country, description, updated_at)
values
  -- A
  ('abib', 'Abib', 'Korean', 'K-beauty skincare brand.', now()),
  ('acwell', 'Acwell', 'Korean', 'K-beauty skincare brand.', now()),
  ('aestura', 'Aestura', 'Korean', 'K-beauty skincare brand.', now()),
  ('age-20s', 'AGE 20''S', 'Korean', 'K-beauty brand.', now()),
  ('ahc', 'AHC', 'Korean', 'K-beauty skincare brand.', now()),
  ('anua', 'Anua', 'Korean', 'K-beauty skincare brand.', now()),
  ('a39pieu', 'A''Pieu', 'Korean', 'K-beauty brand.', now()),
  ('aprilskin', 'APRILSKIN', 'Korean', 'K-beauty brand.', now()),
  ('atopalm', 'ATOPALM', 'Korean', 'K-beauty skincare brand.', now()),
  ('axis---y', 'AXIS-Y', 'Korean', 'K-beauty skincare brand.', now()),
  -- B
  ('banila-co', 'BANILA CO', 'Korean', 'K-beauty brand.', now()),
  ('beauty-of-joseon', 'Beauty of Joseon', 'Korean', 'K-beauty skincare brand.', now()),
  ('benton', 'Benton', 'Korean', 'K-beauty skincare brand.', now()),
  ('biodance', 'Biodance', 'Korean', 'K-beauty skincare brand.', now()),
  ('biolee', 'BIOLEE', 'Korean', 'K-beauty brand.', now()),
  ('blessed-moon', 'BLESSED MOON', 'Korean', 'K-beauty brand.', now()),
  ('baren', 'BAREN', 'Korean', 'K-beauty brand.', now()),
  -- C
  ('catch-me-patch', 'CATCH ME PATCH', 'Korean', 'K-beauty brand.', now()),
  ('ccam-bbak', 'CCAM BBAK', 'Korean', 'K-beauty brand.', now()),
  ('celimax', 'Celimax', 'Korean', 'K-beauty skincare brand.', now()),
  ('centellian24', 'CENTELLIAN24', 'Korean', 'K-beauty skincare brand.', now()),
  ('chosungah', 'Chosungah', 'Korean', 'K-beauty brand.', now()),
  ('ckd', 'CKD', 'Korean', 'K-beauty brand.', now()),
  ('clio', 'CLIO', 'Korean', 'K-beauty makeup brand.', now()),
  ('cnp-laboratory', 'CNP Laboratory', 'Korean', 'K-beauty skincare brand.', now()),
  ('colorgram', 'COLORGRAM', 'Korean', 'K-beauty makeup brand.', now()),
  ('cos-de-baha', 'COS DE BAHA', 'Korean', 'K-beauty skincare brand.', now()),
  ('cosmood', 'COSMOOD', 'Korean', 'K-beauty brand.', now()),
  ('cosrx', 'COSRX', 'Korean', 'K-beauty skincare brand.', now()),
  ('cellfusion-c', 'Cellfusion C', 'Korean', 'K-beauty skincare brand.', now()),
  -- D
  ('dalba', 'D''Alba', 'Korean', 'K-beauty skincare brand.', now()),
  ('darkness', 'DARKNESS', 'Korean', 'K-beauty brand.', now()),
  ('derma-b', 'DERMA:B', 'Korean', 'K-beauty brand.', now()),
  ('drg', 'Dr.G', 'Korean', 'K-beauty skincare brand.', now()),
  ('dong-a', 'DONG-A', 'Korean', 'K-beauty brand.', now()),
  ('donut', 'DONUT', 'Korean', 'K-beauty brand.', now()),
  ('dr-althea', 'Dr. Althea', 'Korean', 'K-beauty skincare brand.', now()),
  ('drceuracle', 'Dr.Ceuracle', 'Korean', 'K-beauty skincare brand.', now()),
  ('dr-forhair', 'Dr.FORHAIR', 'Korean', 'K-beauty haircare brand.', now()),
  ('dr-jart', 'Dr. Jart+', 'Korean', 'K-beauty skincare brand.', now()),
  ('drmelaxin', 'Dr.Melaxin', 'Korean', 'K-beauty skincare brand.', now()),
  -- E
  ('elizavecca', 'ELIZAVECCA', 'Korean', 'K-beauty brand.', now()),
  ('esfolio', 'Esfolio', 'Korean', 'K-beauty brand.', now()),
  ('etude-house', 'Etude House', 'Korean', 'K-beauty makeup brand.', now()),
  ('everydaze', 'EVERYDAZE', 'Korean', 'K-beauty brand.', now()),
  ('espoir', 'ESPOIR', 'Korean', 'K-beauty makeup brand.', now()),
  -- F
  ('frudia', 'Frudia', 'Korean', 'K-beauty brand.', now()),
  ('fully', 'FULLY', 'Korean', 'K-beauty brand.', now()),
  ('fwee', 'FWEE', 'Korean', 'K-beauty makeup brand.', now()),
  -- G
  ('goodal', 'Goodal', 'Korean', 'K-beauty skincare brand.', now()),
  ('goongbe', 'GOONGBE', 'Korean', 'K-beauty brand.', now()),
  ('green-monster', 'GREEN MONSTER', 'Korean', 'K-beauty brand.', now()),
  -- H
  ('happy-bath', 'HAPPY BATH', 'Korean', 'K-beauty bodycare brand.', now()),
  ('haruharu-wonder', 'Haruharu Wonder', 'Korean', 'K-beauty skincare brand.', now()),
  ('heimish', 'heimish', 'Korean', 'K-beauty brand.', now()),
  ('hello-kitty', 'Hello Kitty', 'Korean', 'Licensed K-beauty collaboration brand.', now()),
  ('hince', 'HINCE', 'Korean', 'K-beauty makeup brand.', now()),
  ('heveblue', 'Heveblue', 'Korean', 'K-beauty brand.', now()),
  -- I
  ('illiyoon', 'ILLIYOON', 'Korean', 'K-beauty skincare brand.', now()),
  ('im-from', 'I''m from', 'Korean', 'K-beauty skincare brand.', now()),
  ('incellderm', 'INCELLDERM', 'Korean', 'K-beauty brand.', now()),
  ('innisfree', 'innisfree', 'Korean', 'K-beauty skincare brand.', now()),
  ('isntree', 'Isntree', 'Korean', 'K-beauty skincare brand.', now()),
  ('its-skin', 'IT''S SKIN', 'Korean', 'K-beauty brand.', now()),
  ('iunik', 'iUNIK', 'Korean', 'K-beauty skincare brand.', now()),
  -- J
  ('jayjun-cosmetic', 'Jayjun Cosmetic', 'Korean', 'K-beauty brand.', now()),
  ('jmsolution', 'JMSOLUTION', 'Korean', 'K-beauty brand.', now()),
  ('jumiso', 'JUMISO', 'Korean', 'K-beauty skincare brand.', now()),
  -- K
  ('kahi', 'KAHI', 'Korean', 'K-beauty brand.', now()),
  ('kaine', 'KAINE', 'Korean', 'K-beauty skincare brand.', now()),
  ('kaja', 'KAJA', 'Korean', 'K-beauty makeup brand.', now()),
  ('koelf', 'KOELF', 'Korean', 'K-beauty brand.', now()),
  ('k-secret', 'K-Secret', 'Korean', 'K-beauty brand.', now()),
  ('kwailnara', 'Kwailnara', 'Korean', 'K-beauty brand.', now()),
  -- L
  ('laka', 'LAKA', 'Korean', 'K-beauty makeup brand.', now()),
  ('laneige', 'Laneige', 'Korean', 'K-beauty skincare brand.', now()),
  ('lindsay', 'LINDSAY', 'Korean', 'K-beauty brand.', now()),
  ('luthione', 'LUTHIONE', 'Korean', 'K-beauty brand.', now()),
  -- M
  ('make-prem', 'MAKE P:REM', 'Korean', 'K-beauty skincare brand.', now()),
  ('manyo', 'ma:nyo', 'Korean', 'K-beauty skincare brand.', now()),
  ('mary-may', 'Mary & May', 'Korean', 'K-beauty skincare brand.', now()),
  ('medicube', 'MediCube', 'Korean', 'K-beauty skincare / device brand.', now()),
  ('mediheal', 'Mediheal', 'Korean', 'K-beauty mask & skincare brand.', now()),
  ('medi-peel', 'MEDI-PEEL', 'Korean', 'K-beauty skincare brand.', now()),
  ('mise-en-scene', 'MISE EN SCENE', 'Korean', 'K-beauty haircare brand.', now()),
  ('missha', 'Missha', 'Korean', 'K-beauty brand.', now()),
  ('mixsoon', 'Mixsoon', 'Korean', 'K-beauty skincare brand.', now()),
  ('mizon', 'Mizon', 'Korean', 'K-beauty skincare brand.', now()),
  ('modamoda', 'MODAMODA', 'Korean', 'K-beauty brand.', now()),
  -- N
  ('nature-republic', 'NATURE REPUBLIC', 'Korean', 'K-beauty brand.', now()),
  ('needly', 'Needly', 'Korean', 'K-beauty skincare brand.', now()),
  ('nine-less', 'NINE LESS', 'Korean', 'K-beauty skincare brand.', now()),
  ('numbuzin', 'Numbuzin', 'Korean', 'K-beauty skincare brand.', now()),
  ('nacific', 'Nacific', 'Korean', 'K-beauty skincare brand.', now()),
  -- O
  ('on-the-body', 'ON THE BODY', 'Korean', 'K-beauty bodycare brand.', now()),
  -- P
  ('peripera', 'PERIPERA', 'Korean', 'K-beauty makeup brand.', now()),
  ('petitfee', 'Petitfee', 'Korean', 'K-beauty brand.', now()),
  ('purcell', 'Purcell', 'Korean', 'K-beauty brand.', now()),
  ('purito', 'PURITO', 'Korean', 'K-beauty skincare brand.', now()),
  ('pyunkang-yul', 'Pyunkang Yul', 'Korean', 'K-beauty skincare brand.', now()),
  -- R
  ('real-barrier', 'REAL BARRIER', 'Korean', 'K-beauty skincare brand.', now()),
  ('rejuran', 'REJURAN', 'Korean', 'K-beauty skincare brand.', now()),
  ('romand', 'Romand', 'Korean', 'K-beauty makeup brand.', now()),
  ('round-lab', 'Round Lab', 'Korean', 'K-beauty skincare brand.', now()),
  ('ryo', 'RYO', 'Korean', 'K-beauty haircare brand.', now()),
  -- S
  ('snature', 'S.NATURE', 'Korean', 'K-beauty skincare brand.', now()),
  ('secret-key', 'SECRET KEY', 'Korean', 'K-beauty brand.', now()),
  ('skin1004', 'SKIN1004', 'Korean', 'K-beauty skincare brand.', now()),
  ('skinfood', 'Skinfood', 'Korean', 'K-beauty brand.', now()),
  ('some-by-mi', 'Some By Mi', 'Korean', 'K-beauty skincare brand.', now()),
  ('son-and-park', 'son&park', 'Korean', 'K-beauty brand.', now()),
  ('snp', 'SNP', 'Korean', 'K-beauty brand.', now()),
  ('sungboon-editor', 'SUNGBOON EDITOR', 'Korean', 'K-beauty brand.', now()),
  -- T
  ('tfit', 'TFIT', 'Korean', 'K-beauty makeup brand.', now()),
  ('the-face-shop', 'THEFACESHOP', 'Korean', 'K-beauty brand.', now()),
  ('tirtir', 'Tirtir', 'Korean', 'K-beauty brand.', now()),
  ('tocobo', 'Tocobo', 'Korean', 'K-beauty skincare brand.', now()),
  ('tonymoly', 'TONYMOLY', 'Korean', 'K-beauty brand.', now()),
  ('too-cool-for-school', 'TOO COOL FOR SCHOOL', 'Korean', 'K-beauty brand.', now()),
  ('torriden', 'Torriden', 'Korean', 'K-beauty skincare brand.', now()),
  ('touch-in-sol', 'TOUCH IN SOL', 'Korean', 'K-beauty brand.', now()),
  -- U
  ('unove', 'UNOVE', 'Korean', 'K-beauty brand.', now()),
  ('unleashia', 'UNLEASHIA', 'Korean', 'K-beauty makeup brand.', now()),
  -- V
  ('vt-cosmetics', 'VT Cosmetics', 'Korean', 'K-beauty skincare brand.', now()),
  -- W
  ('w-dressroom', 'W.DRESSROOM', 'Korean', 'K-beauty brand.', now()),
  ('wakemake', 'WAKEMAKE', 'Korean', 'K-beauty makeup brand.', now())
on conflict (slug) do update set
  name       = excluded.name,
  country    = 'Korean',
  -- only fill description if empty so editorial copy is not clobbered
  description = coalesce(gb_brands.description, excluded.description),
  updated_at = now();

commit;
