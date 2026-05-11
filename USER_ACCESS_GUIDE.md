# 🎯 BCALearn Platform - Complete User Guide

## 🚀 How Different Users Access Content

### **For Students (Regular Users)**

Students access content through the **Dashboard**, not the Admin Panel.

#### **Student Access Flow:**

1. **Sign Up/Login** → `http://localhost:5173/auth`
2. **Dashboard** → `http://localhost:5173/dashboard`
3. **View Modules** → Click on any module to see lessons
4. **View Lessons** → Click on any lesson to view content
5. **Track Progress** → Progress is automatically tracked

#### **What Students Can Do:**
- ✅ View all published modules and lessons
- ✅ Read/view PDF content (view-only, no download)
- ✅ Track their learning progress
- ✅ See their overall statistics
- ✅ Search for specific modules or lessons
- ✅ Continue from where they left off

#### **What Students Cannot Do:**
- ❌ Access Admin Panel
- ❌ Upload or delete files
- ❌ Create or edit modules/lessons
- ❌ Manage other users
- ❌ Download PDF files (view-only)

---

### **For Admin (You)**

You access content management through the **Admin Panel**.

#### **Admin Access Flow:**

1. **Sign In** → `http://localhost:5173/auth`
2. **Admin Panel** → `http://localhost:5173/admin`
3. **Manage Content** → Use the 4 tabs

---

## 📋 Admin Panel - Tab Functions

### **1. Modules Tab** 📚

**Purpose:** Create and manage course modules

**What You Can Do:**
- ✅ **Create new modules** (subjects like "Programming Fundamentals")
- ✅ **View all existing modules**
- ✅ **Delete modules** (also deletes all lessons in that module)
- ✅ **Set module properties:**
  - Title and description
  - Icon (emoji)
  - Color (for visual organization)
  - Semester (1-8)
  - Display order
  - Published status

**How to Use:**
1. Click "Add Module" button
2. Fill in module details
3. Click "Create Module"
4. Module appears in student Dashboard

**Example:**
- Title: "Programming Fundamentals"
- Description: "Learn C programming basics"
- Icon: 💻
- Color: #5b6af0
- Semester: 1

---

### **2. Lessons Tab** 📖

**Purpose:** Create and manage individual lessons within modules

**What You Can Do:**
- ✅ **Create new lessons** (PDFs, Notion pages, videos, external links)
- ✅ **View all existing lessons**
- ✅ **Edit lesson details**
- ✅ **Delete lessons**
- **Set lesson properties:**
  - Title and description
  - Content type (PDF, Notion, Video, External)
  - Source URL (from uploaded files)
  - Duration (in minutes)
  - Page count (for PDFs)
  - Display order
  - Published status

**How to Use:**
1. **First upload PDFs** in "Upload Content" tab
2. **Copy file URLs** from "All Uploaded Files" section
3. **Go to "Lessons" tab**
4. **Click "Add Lesson" button**
5. **Fill in lesson details:**
   - Select module
   - Enter title and description
   - Choose content type (PDF)
   - Paste the file URL
   - Set duration and page count
6. Click "Create Lesson"
7. Lesson appears in student Dashboard

**Example:**
- Module: "Programming Fundamentals"
- Title: "Introduction to C Programming"
- Type: PDF
- URL: (paste from uploaded files)
- Duration: 45 minutes
- Pages: 12

---

### **3. Upload Content Tab** 📤

**Purpose:** Upload PDF files to Supabase Storage

**What You Can Do:**
- ✅ **Upload up to 20 PDF files at once**
- ✅ **View all uploaded files** in one place
- **Copy file URLs** with one click
- **View files** in new tab
- **Delete files** from storage
- **Refresh file list** to see changes

**How to Use:**
1. **Click "Upload Content" tab**
2. **Click "Select Files"** → Choose PDFs from your computer
3. **Click "Upload"** → Files upload to Supabase Storage
4. **See success notification** when complete
5. **Copy file URLs** from "All Uploaded Files" section
6. **Use URLs** when creating lessons

**File Management:**
- **Copy URL**: Click copy icon → URL copied to clipboard
- **View File**: Click download icon → Opens in new tab
- **Delete File**: Click trash icon → File removed from storage

**Storage Location:**
- Files stored in: `lesson-pdfs` bucket in Supabase Storage
- NOT in database (keeps database light)
- Accessible via public URLs

---

### **4. Users Tab** 👥

**Purpose:** View and manage user accounts

**What You Can Do:**
- ✅ **View all registered users**
- ✅ **See user details:**
  - Name and email
  - Current role (Student/Admin/Instructor)
  - Semester
  - Last sign-in date
- ✅ **Change user roles:**
  - Promote students to admin
  - Demote admins to student
  - Assign instructor role
- ✅ **Refresh user list** to see changes

**How to Use:**
1. **Click "Users" tab**
2. **See all registered users** with their details
3. **Change role** using dropdown menu next to each user
4. **Click "Refresh"** to see latest user activity

**User Roles:**
- **Student**: Can view content and track progress
- **Admin**: Full access to Admin Panel
- **Instructor**: Can manage their own content (future feature)

---

## 🔄 Complete Content Creation Workflow

### **Step 1: Create Modules**
1. **Go to Admin Panel** → "Modules" tab
2. **Click "Add Module"**
3. **Create modules** for each subject:
   - Programming Fundamentals
   - Data Structures
   - Database Management
   - Web Technologies
   - etc.

### **Step 2: Upload PDF Files**
1. **Go to "Upload Content" tab**
2. **Upload your PDFs** from `E:\Stractured_Learning`
3. **Copy file URLs** from "All Uploaded Files" section

### **Step 3: Create Lessons**
1. **Go to "Lessons" tab**
2. **Click "Add Lesson"**
3. **For each PDF:**
   - Select the appropriate module
   - Enter lesson title
   - Choose "PDF" as content type
   - Paste the file URL
   - Set duration and page count
   - Click "Create Lesson"

### **Step 4: Test as Student**
1. **Sign out** as admin
2. **Sign in** as a test student
3. **Go to Dashboard**
4. **View modules and lessons**
5. **Verify content is accessible**

---

## 🎨 Student Experience

### **What Students See:**

**Dashboard:**
- Welcome message with their name
- Overall progress statistics
- Search bar to find content
- All published modules with progress indicators
- "Continue Learning" section
- Subject-wise progress breakdown

**Module View:**
- Module details with icon and color
- List of all lessons in the module
- Progress indicators for each lesson
- Click to view lesson content

**Lesson Viewer:**
- PDF viewer with navigation controls
- Page-by-page viewing
- Progress tracking
- "Mark as Complete" button
- Next/Previous lesson navigation

**Progress Tracking:**
- Automatic progress updates
- Visual progress indicators
- Completion statistics
- Overall progress percentage

---

## 🔒 Security & Access Control

### **Content Access:**
- **Only published content** is visible to students
- **Draft modules/lessons** are hidden
- **Admin-only content** is protected

### **User Roles:**
- **Student**: View-only access to published content
- **Admin**: Full content management access
- **Instructor**: Can manage their own content (future)

### **File Security:**
- **PDFs are view-only** (no download option)
- **Right-click disabled** on PDF viewer
- **Keyboard shortcuts disabled** for downloading
- **Files stored in Supabase Storage** (not database)

---

## 📊 Content Organization

### **Recommended Structure:**

```
BCALearn Platform
├── Modules (Subjects)
│   ├── Programming Fundamentals (Semester 1)
│   │   ├── Lesson 1: Introduction to C
│   │   ├── Lesson 2: Variables & Data Types
│   │   └── Lesson 3: Control Structures
│   ├── Data Structures (Semester 2)
│   │   ├── Lesson 1: Introduction to Data Structures
│   │   ├── Lesson 2: Arrays and Linked Lists
│   │   └── Lesson 3: Trees and Graphs
│   └── ... (6 more modules)
├── Lessons (Content)
│   ├── PDF files (uploaded via Admin Panel)
│   ├── Notion pages (external links)
│   ├── Videos (YouTube links)
│   └── External resources
└── User Progress
    ├── Per-lesson completion status
    ├── Overall progress percentage
    └── Learning statistics
```

---

## 🎯 Quick Reference

### **For Creating Content:**
1. **Modules Tab** → Create subjects
2. **Upload Tab** → Upload PDFs
3. **Lessons Tab** → Create lessons with file URLs

### **For Managing Content:**
1. **Modules Tab** → Edit/delete modules
2. **Lessons Tab** → Edit/delete lessons
3. **Upload Tab** → Delete uploaded files
4. **Users Tab** → Manage user roles

### **For Testing:**
1. **Sign out** as admin
2. **Sign in** as test student
3. **Go to Dashboard** → View content
4. **Verify** everything works correctly

---

## 🚀 Ready to Use!

Your BCALearn platform is now fully functional with:

- ✅ **Complete admin panel** with all 4 tabs working
- ✅ **File upload** with delete functionality
- ✅ **Lesson creation** with "Add Lesson" button working
- ✅ **User management** with role changes
- ✅ **View-only PDF access** for students
- ✅ **Beautiful notifications** for all actions
- ✅ **Optimized performance** for file operations

**Students access content through Dashboard, while you manage everything through Admin Panel!**