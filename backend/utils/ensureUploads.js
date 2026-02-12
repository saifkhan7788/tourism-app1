import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created');
} else {
  console.log('✅ Uploads directory exists');
}

export default uploadsDir;