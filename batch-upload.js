/**
 * BCALearn Batch PDF Upload Helper
 *
 * This script helps you upload multiple PDF files from your local directory
 * to Supabase Storage and automatically generates lesson data.
 *
 * Usage:
 * 1. Install dependencies: npm install @supabase/supabase-js
 * 2. Update the configuration below
 * 3. Run: node batch-upload.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://wutntfsizmxmjhhgduew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dG50ZnNpem14bWpoaGdkdWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTMxMjksImV4cCI6MjA5Mzk4OTEyOX0._ndlqSN1ujOOhgHxtmb01RhPsq-KBmX9QDPiH3ZHZLw';

// Your local PDF directory
const LOCAL_PDF_DIR = 'E:\\Stractured_Learning';

// Module mapping (folder name -> module details)
const MODULE_MAPPING = {
  'Programming_Fundamentals': {
    title: 'Programming Fundamentals',
    description: 'Master the basics of programming with C language',
    icon: '💻',
    color: '#5b6af0',
    semester: 1
  },
  'Data_Structures': {
    title: 'Data Structures & Algorithms',
    description: 'Learn essential data structures and algorithms',
    icon: '🔗',
    color: '#4ecca3',
    semester: 2
  },
  'Database_Management': {
    title: 'Database Management Systems',
    description: 'Understand relational databases and SQL',
    icon: '🗄️',
    color: '#f0b15b',
    semester: 3
  }
  // Add more modules as needed
};

// ============================================
// SUPABASE CLIENT
// ============================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// UPLOAD FUNCTIONS
// ============================================

async function uploadPDF(filePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileNameClean = fileName.replace(/\s+/g, '_');
    const storagePath = `lesson-pdfs/${Date.now()}_${fileNameClean}`;

    const { data, error } = await supabase.storage
      .from('lesson-pdfs')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('lesson-pdfs')
      .getPublicUrl(storagePath);

    return {
      path: storagePath,
      url: publicUrl,
      name: fileName
    };
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    return null;
  }
}

async function createModule(moduleData) {
  try {
    const { data, error } = await supabase
      .from('modules')
      .insert({
        title: moduleData.title,
        description: moduleData.description,
        icon: moduleData.icon,
        color: moduleData.color,
        semester: moduleData.semester,
        order_index: 1, // You might want to calculate this
        is_published: true
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Created module: ${moduleData.title}`);
    return data;
  } catch (error) {
    console.error(`❌ Error creating module ${moduleData.title}:`, error.message);
    return null;
  }
}

async function createLesson(moduleId, lessonData) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        module_id: moduleId,
        title: lessonData.title,
        description: lessonData.description || lessonData.title,
        type: 'pdf',
        source_url: lessonData.url,
        order_index: lessonData.order,
        duration_minutes: lessonData.duration || 45,
        page_count: lessonData.pages || 0,
        is_published: true
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Created lesson: ${lessonData.title}`);
    return data;
  } catch (error) {
    console.error(`❌ Error creating lesson ${lessonData.title}:`, error.message);
    return null;
  }
}

// ============================================
// MAIN PROCESSING
// ============================================

async function processDirectory() {
  console.log('🚀 Starting batch upload...');
  console.log(`📁 Source directory: ${LOCAL_PDF_DIR}\n`);

  try {
    // Check if directory exists
    if (!fs.existsSync(LOCAL_PDF_DIR)) {
      throw new Error(`Directory not found: ${LOCAL_PDF_DIR}`);
    }

    // Get all subdirectories (modules)
    const moduleDirs = fs.readdirSync(LOCAL_PDF_DIR)
      .filter(item => {
        const itemPath = path.join(LOCAL_PDF_DIR, item);
        return fs.statSync(itemPath).isDirectory();
      });

    console.log(`📚 Found ${moduleDirs.length} module directories\n`);

    // Process each module directory
    for (const moduleDir of moduleDirs) {
      const modulePath = path.join(LOCAL_PDF_DIR, moduleDir);
      const moduleConfig = MODULE_MAPPING[moduleDir];

      if (!moduleConfig) {
        console.log(`⚠️  No configuration for module: ${moduleDir} (skipping)`);
        continue;
      }

      console.log(`\n📖 Processing module: ${moduleConfig.title}`);

      // Create or get module
      let module = await supabase
        .from('modules')
        .select('*')
        .eq('title', moduleConfig.title)
        .single();

      if (!module.data) {
        module = await createModule(moduleConfig);
      } else {
        console.log(`ℹ️  Module already exists: ${moduleConfig.title}`);
      }

      if (!module || !module.data) continue;

      const moduleId = module.data.id;

      // Get all PDF files in the module directory
      const pdfFiles = fs.readdirSync(modulePath)
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .sort(); // Sort alphabetically for ordering

      console.log(`📄 Found ${pdfFiles.length} PDF files`);

      // Process each PDF file
      for (let i = 0; i < pdfFiles.length; i++) {
        const pdfFile = pdfFiles[i];
        const pdfPath = path.join(modulePath, pdfFile);

        console.log(`\n   📤 Uploading: ${pdfFile}`);

        // Upload PDF
        const uploaded = await uploadPDF(pdfPath, pdfFile);

        if (uploaded) {
          // Extract lesson info from filename
          const lessonTitle = pdfFile
            .replace('.pdf', '')
            .replace(/^\d+_/, '') // Remove number prefix
            .replace(/_/g, ' '); // Replace underscores with spaces

          // Create lesson
          await createLesson(moduleId, {
            title: lessonTitle,
            url: uploaded.url,
            order: i + 1,
            duration: 45, // Default duration
            pages: 0 // Will need to calculate or set manually
          });
        }
      }
    }

    console.log('\n✅ Batch upload completed!');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// ============================================
// RUN THE SCRIPT
// ============================================

// Check if directory exists
if (!fs.existsSync(LOCAL_PDF_DIR)) {
  console.error(`❌ Directory not found: ${LOCAL_PDF_DIR}`);
  console.log('Please update the LOCAL_PDF_DIR in the script configuration.');
  process.exit(1);
}

// Run the upload
processDirectory().then(() => {
  console.log('\n🎉 All done! Check your Supabase dashboard for uploaded content.');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});