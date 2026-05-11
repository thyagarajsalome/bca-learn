# BCALearn Admin Setup Guide

## 🚀 Complete Admin System Setup

### Step 1: Database Setup

1. **Run the admin setup SQL** in your Supabase SQL Editor:
   - Open `admin-setup.sql`
   - Copy and paste the content into Supabase SQL Editor
   - Run the query

2. **Set up Supabase Storage**:
   - Go to Storage section in Supabase Dashboard
   - Create new bucket named: `lesson-pdfs`
   - Enable public access
   - Add this policy for public read access:
   ```sql
   -- Run this in Supabase SQL Editor
   create policy "Public can view PDFs"
   on storage.objects for select
   using (bucket_id = 'lesson-pdfs');
   ```

### Step 2: Create Your Admin Account

1. **Sign up** at `http://localhost:5173/auth`
2. **Get your user ID** by running this in Supabase SQL Editor:
   ```sql
   SELECT id, email FROM auth.users;
   ```
3. **Make yourself admin** by running:
   ```sql
   select make_admin('YOUR_USER_ID_HERE');
   ```
4. **Verify admin status**:
   ```sql
   SELECT id, name, role FROM profiles WHERE role = 'admin';
   ```

### Step 3: Access Admin Panel

1. **Sign in** to your account
2. **Go to**: `http://localhost:5173/admin`
3. **You should see** the admin panel with full access

## 📁 Uploading Your PDF Files

### Option 1: Using the Admin Panel (Recommended)

1. **Go to Admin Panel** → "Upload Content" tab
2. **Drag and drop** your PDF files from `E:\Stractured_Learning`
3. **Click "Upload"** to upload to Supabase Storage
4. **Files will be available** for creating lessons

### Option 2: Manual Upload via Supabase Dashboard

1. **Go to Storage** → `lesson-pdfs` bucket
2. **Click "Upload"** button
3. **Select files** from `E:\Stractured_Learning`
4. **Upload** all your PDF files

### Option 3: Using the File Upload Component

The admin panel includes a drag-and-drop file upload interface that:
- ✅ Accepts PDF files only
- ✅ Handles multiple files at once
- ✅ Shows upload progress
- ✅ Provides file URLs after upload
- ✅ Validates file size (max 50MB)

## 🎯 Creating Content from Your PDFs

### Step 1: Upload PDFs

Use any of the upload methods above to get your PDFs into Supabase Storage.

### Step 2: Create Modules

1. **Go to Admin Panel** → "Modules" tab
2. **Click "Add Module"**
3. **Fill in module details**:
   - Title: e.g., "Programming Fundamentals"
   - Description: Course description
   - Icon: Choose an emoji
   - Color: Pick a color
   - Semester: 1-8
   - Order: Display order

### Step 3: Create Lessons

1. **Go to Admin Panel** → "Lessons" tab
2. **Click "Add Lesson"**
3. **Fill in lesson details**:
   - Module: Select the module
   - Title: Lesson name
   - Description: Lesson description
   - Type: Select "PDF"
   - Source URL: Paste the URL from uploaded files
   - Duration: Estimated time in minutes
   - Order: Display order

## 📂 Organizing Your Content

### Suggested Structure for `E:\Stractured_Learning`

```
E:\Stractured_Learning/
├── 01_Programming_Fundamentals/
│   ├── 01_Introduction.pdf
│   ├── 02_Variables.pdf
│   ├── 03_Control_Structures.pdf
│   └── ...
├── 02_Data_Structures/
│   ├── 01_Introduction.pdf
│   ├── 02_Arrays.pdf
│   └── ...
├── 03_Database_Management/
│   └── ...
└── ...
```

### Naming Convention

- Use numbered prefixes for order: `01_`, `02_`, etc.
- Use underscores instead of spaces
- Keep names descriptive but concise
- Example: `01_Introduction_to_C.pdf`

## 🔧 Advanced Features

### Batch Upload Script

For uploading many files at once, you can use this approach:

1. **Organize your files** by module in folders
2. **Upload each folder** separately
3. **Create lessons** referencing the uploaded files

### Content Management

The admin panel provides:
- ✅ **Modules Management**: Create, edit, delete modules
- ✅ **Lessons Management**: Create, edit, delete lessons
- ✅ **File Upload**: Drag-and-drop PDF upload
- ✅ **Users Management**: View users and change roles
- ✅ **Progress Tracking**: Monitor user progress

### User Roles

- **Student**: Can view content and track progress
- **Instructor**: Can manage their own content
- **Admin**: Full access to all features

## 🚀 Quick Start Checklist

- [ ] Run `admin-setup.sql` in Supabase
- [ ] Create `lesson-pdfs` storage bucket
- [ ] Sign up for an account
- [ ] Make yourself admin using SQL
- [ ] Access admin panel at `/admin`
- [ ] Upload PDF files from `E:\Stractured_Learning`
- [ ] Create modules for your content
- [ ] Create lessons referencing uploaded PDFs
- [ ] Test the content as a student

## 🐛 Troubleshooting

### Admin Panel Not Accessible

**Problem**: Can't access `/admin` route

**Solution**:
1. Check if you're logged in
2. Verify your role is 'admin' in profiles table
3. Run: `SELECT id, name, role FROM profiles WHERE id = 'your_user_id';`

### File Upload Fails

**Problem**: Files won't upload

**Solution**:
1. Check if `lesson-pdfs` bucket exists
2. Verify bucket has public access enabled
3. Check file size is under 50MB
4. Ensure files are PDF format

### PDFs Not Loading

**Problem**: Uploaded PDFs won't display

**Solution**:
1. Check file URLs are correct
2. Verify storage bucket policies
3. Test URLs directly in browser
4. Check browser console for errors

## 📞 Need Help?

If you encounter issues:

1. **Check browser console** for error messages
2. **Verify Supabase settings** are correct
3. **Test database queries** in SQL Editor
4. **Check storage bucket** configuration

---

**Ready to upload your content?** Start with Step 1 above!