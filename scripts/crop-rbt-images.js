/* Crop roofing-business-tools screenshots to uniform aspect ratios per set. */
const sharp = require('sharp');
const path = require('path');

const DIR = 'public/assets/roofing-business-tools';

const JOBS = [
  { files: ['assistant-1.jpg','assistant-2.jpg','assistant-3.jpg','assistant-4.jpg','assistant-5.jpg','assistant-6.jpg'], w: 880, h: 1100 },
  { files: ['measure-2.jpg','measure-3.jpg'], w: 1500, h: 1200 },
  { files: ['takeoff-1.jpg','takeoff-2.jpg','takeoff-3.jpg'], w: 1600, h: 1200 },
  { files: ['trade-1.jpg','trade-2.jpg'], w: 1400, h: 1120 },
  { files: ['admin-1.jpg','admin-2.jpg','admin-3.jpg'], w: 1900, h: 1000 },
];

(async () => {
  for (const job of JOBS) {
    for (const f of job.files) {
      const src = path.join(DIR, f);
      const tmp = src + '.tmp';
      await sharp(src).resize(job.w, job.h, { fit: 'cover', position: 'centre' }).jpeg({ quality: 85 }).toFile(tmp);
      require('fs').renameSync(tmp, src);
      const meta = await sharp(src).metadata();
      console.log(`${f}: ${meta.width}x${meta.height}`);
    }
  }
})();
