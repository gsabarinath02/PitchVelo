# 🎯 USER ONBOARDING & ANALYTICS LOCATION GUIDE

## 📍 **Where to Find User Onboarding and Analytics**

### **🎯 Admin Dashboard Location**
**URL**: http://localhost:3000/admin

**How to Access:**
1. Login with admin@example.com / admin123
2. Go to dashboard
3. Click user dropdown in header
4. Select "Admin Dashboard"
5. Or directly visit: http://localhost:3000/admin

---

## 👥 **USER ONBOARDING FEATURES**

### **📍 Location: Admin Dashboard → "Users" Tab**

#### **User Management Features:**
- ✅ **View All Users** - Complete user list with details
- ✅ **Create New Users** - Add user button with form
- ✅ **User Roles** - Admin/User role management
- ✅ **User Details** - Email, username, creation date
- ✅ **User Actions** - Edit and delete options

#### **User Onboarding Process:**
1. **Admin creates user account** via "Add User" button
2. **User receives credentials** (email/password)
3. **User logs in** at http://localhost:3000/login
4. **User completes presentation** and feedback form
5. **Admin monitors** user activity in analytics

#### **User Creation Form:**
- **Email**: User's email address
- **Username**: Display name
- **Password**: Secure password
- **Role**: User or Admin role selection

---

## 📊 **ANALYTICS FEATURES**

### **📍 Location: Admin Dashboard → "Analytics" Tab**

#### **Analytics Dashboard Features:**

##### **1. User Analytics Overview**
- **Login Events**: Track user login frequency and timing
- **Page Visits**: Monitor which pages users visit
- **Form Submissions**: Track feedback submissions
- **Average Ratings**: Overall user satisfaction scores

##### **2. Detailed Analytics Per User**
- **User Profile**: Name, email, role, creation date
- **Login History**: All login timestamps
- **Page Visit Details**: 
  - Page names visited
  - Entry and exit times
  - Duration spent on each page
- **Form Submission Details**:
  - Rating scores (1-5 stars)
  - Feedback text
  - Submission timestamps

##### **3. Real-time Metrics**
- **Total Users**: Number of registered users
- **Total Page Visits**: Overall engagement
- **Total Submissions**: Feedback collection
- **Average Rating**: Platform satisfaction score

---

## 🎯 **SPECIFIC ANALYTICS DATA**

### **User Activity Tracking:**
- ✅ **Login Events**: When users log in
- ✅ **Page Visits**: Which pages they visit
- ✅ **Time Spent**: Duration on each page
- ✅ **Form Submissions**: Feedback and ratings
- ✅ **User Engagement**: Overall participation metrics

### **Presentation Analytics:**
- ✅ **Slide Progress**: Which slides users view
- ✅ **Completion Rate**: How many finish the presentation
- ✅ **Feedback Quality**: Rating distribution
- ✅ **Contact Information**: User contact details
- ✅ **Service Interest**: Which services users select

---

## 🔍 **HOW TO ACCESS ANALYTICS**

### **Step-by-Step Instructions:**

#### **1. Access Admin Dashboard**
```
URL: http://localhost:3000/admin
Login: admin@example.com / admin123
```

#### **2. Navigate to Analytics**
- Click on **"Analytics"** tab in admin dashboard
- View comprehensive user analytics

#### **3. View User Management**
- Click on **"Users"** tab in admin dashboard
- Manage user accounts and onboarding

#### **4. Overview Dashboard**
- Click on **"Overview"** tab for summary statistics
- See platform-wide metrics and insights

---

## 📈 **ANALYTICS DATA STRUCTURE**

### **User Analytics Include:**
```javascript
{
  user: {
    id: number,
    email: string,
    username: string,
    role: string,
    created_at: string
  },
  login_events: [
    {
      id: number,
      user_id: number,
      login_timestamp: string
    }
  ],
  page_visits: [
    {
      id: number,
      user_id: number,
      page_name: string,
      entry_time: string,
      exit_time: string,
      duration_seconds: number
    }
  ],
  form_submissions: [
    {
      id: number,
      user_id: number,
      feedback: string,
      rating: number,
      submitted_at: string
    }
  ]
}
```

---

## 🎯 **USER ONBOARDING FLOW**

### **Complete User Journey:**

#### **1. Admin Creates User**
- Admin goes to http://localhost:3000/admin
- Clicks "Users" tab
- Clicks "Add User" button
- Fills out user creation form
- User account is created

#### **2. User Receives Access**
- User gets email/password credentials
- User visits http://localhost:3000/login
- User logs in with provided credentials

#### **3. User Completes Journey**
- User views presentation slides
- User fills out feedback form
- User provides contact information
- User submits feedback

#### **4. Admin Monitors Activity**
- Admin views analytics in admin dashboard
- Admin tracks user engagement
- Admin reviews feedback submissions
- Admin manages user accounts

---

## 🚀 **QUICK ACCESS LINKS**

### **Direct URLs:**
- **Admin Dashboard**: http://localhost:3000/admin
- **User Management**: http://localhost:3000/admin (Users tab)
- **Analytics**: http://localhost:3000/admin (Analytics tab)
- **Overview**: http://localhost:3000/admin (Overview tab)

### **Default Admin Credentials:**
- **Email**: admin@example.com
- **Password**: admin123

---

## 📊 **ANALYTICS FEATURES SUMMARY**

### **User Onboarding:**
- ✅ User account creation
- ✅ Role assignment (User/Admin)
- ✅ Credential management
- ✅ User activity tracking

### **Analytics Dashboard:**
- ✅ Real-time user metrics
- ✅ Page visit tracking
- ✅ Form submission analytics
- ✅ User engagement scores
- ✅ Detailed user profiles
- ✅ Login history tracking

### **Data Visualization:**
- ✅ Statistics cards with metrics
- ✅ User activity timelines
- ✅ Rating distributions
- ✅ Engagement analytics
- ✅ Performance insights

**All user onboarding and analytics features are available in the Admin Dashboard at http://localhost:3000/admin** 🎯 