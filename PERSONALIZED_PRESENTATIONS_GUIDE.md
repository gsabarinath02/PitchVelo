# 🎯 Personalized Presentations Feature Guide

## 📋 Overview

The Personalized Presentations feature allows admins to create customized presentations for individual users. When users log in, they will see their personalized content instead of the default presentation.

## 🚀 Features

### **Admin Features:**
- ✅ **Create Personalized Presentations** - Customize content for specific users
- ✅ **Manage Presentations** - View, edit, activate/deactivate presentations
- ✅ **User Selection** - Choose which user gets the personalized content
- ✅ **Content Customization** - Modify titles, subtitles, and slide content
- ✅ **Status Management** - Activate or deactivate presentations

### **User Features:**
- ✅ **Personalized Experience** - See custom content when logged in
- ✅ **Fallback Support** - Default presentation if no personalized content exists
- ✅ **Seamless Integration** - Works with existing analytics and form submission

## 🛠️ How to Use

### **For Admins:**

#### **1. Access Personalized Presentations**
1. Login as admin at http://localhost:3000/login
2. Go to Admin Dashboard at http://localhost:3000/admin
3. Click on "Personalized Presentations" tab

#### **2. Create a Personalized Presentation**
1. Click "Create Presentation" button
2. Select a user from the dropdown
3. Enter custom title and subtitle (optional)
4. Set active status
5. Click "Create Presentation"

#### **3. Manage Existing Presentations**
- **View**: See all personalized presentations in a table
- **Activate/Deactivate**: Toggle presentation status
- **Edit**: Modify presentation content (coming soon)
- **Delete**: Remove personalized presentations

### **For Users:**

#### **1. View Personalized Content**
1. Login with your credentials
2. Navigate to the presentation page
3. View your personalized content automatically

#### **2. Fallback Experience**
- If no personalized presentation exists, users see the default presentation
- All existing functionality (analytics, form submission) works normally

## 📊 Database Schema

### **PersonalizedPresentation Table:**
```sql
CREATE TABLE personalized_presentations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR,
    subtitle VARCHAR,
    slides JSON,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Slide Content Structure:**
```json
{
  "id": 1,
  "title": "Custom Slide Title",
  "subtitle": "Custom Slide Subtitle",
  "content": {
    "type": "welcome|platform|creative|pricing|benefits|cta",
    "features": [...],
    "pricing": {...},
    "nextSteps": [...],
    "contact": {...}
  }
}
```

## 🔧 API Endpoints

### **Create Personalized Presentation**
```http
POST /forms/personalized-presentations
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "user_id": 1,
  "title": "Custom Presentation",
  "subtitle": "Personalized for John Doe",
  "slides": [...],
  "is_active": true
}
```

### **Get All Personalized Presentations (Admin)**
```http
GET /forms/personalized-presentations
Authorization: Bearer <admin_token>
```

### **Get User's Personalized Presentation**
```http
GET /forms/personalized-presentations/{user_id}
Authorization: Bearer <user_token>
```

### **Update Personalized Presentation**
```http
PUT /forms/personalized-presentations/{presentation_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "is_active": false
}
```

### **Delete Personalized Presentation**
```http
DELETE /forms/personalized-presentations/{presentation_id}
Authorization: Bearer <admin_token>
```

## 🎨 Frontend Components

### **PersonalizedPresentationsManager**
- Location: `frontend/components/PersonalizedPresentationsManager.tsx`
- Purpose: Admin interface for managing personalized presentations
- Features: Create, view, edit, delete presentations

### **PersonalizedPresentationViewer**
- Location: `frontend/components/PersonalizedPresentationViewer.tsx`
- Purpose: Display personalized presentations to users
- Features: Dynamic content rendering, fallback to default slides

## 🔄 Workflow

### **Admin Workflow:**
1. **Login** as admin
2. **Navigate** to Personalized Presentations tab
3. **Create** presentation for specific user
4. **Customize** content as needed
5. **Activate** presentation
6. **Monitor** user engagement

### **User Workflow:**
1. **Login** with credentials
2. **View** personalized presentation automatically
3. **Complete** presentation and form submission
4. **Provide** feedback and contact information

## 🎯 Content Types

### **Supported Slide Types:**
1. **Welcome** - Introduction with logos and key features
2. **Platform** - Technology features and capabilities
3. **Creative** - Marketing and creative services
4. **Pricing** - Investment and pricing information
5. **Benefits** - Value proposition and advantages
6. **CTA** - Call to action and next steps

### **Customization Options:**
- **Titles** - Custom slide titles
- **Subtitles** - Custom slide subtitles
- **Content** - Full JSON content customization
- **Features** - Custom feature lists
- **Pricing** - Custom pricing information
- **Contact** - Custom contact details

## 🔒 Security & Permissions

### **Admin Permissions:**
- ✅ Create personalized presentations
- ✅ View all personalized presentations
- ✅ Update any personalized presentation
- ✅ Delete personalized presentations
- ✅ Toggle presentation status

### **User Permissions:**
- ✅ View their own personalized presentation
- ✅ Access default presentation if no personalized content
- ✅ Complete forms and provide feedback

## 📈 Analytics Integration

### **Existing Analytics:**
- ✅ Page visit tracking works with personalized presentations
- ✅ Form submission tracking continues to work
- ✅ User engagement metrics are preserved
- ✅ Login/logout tracking remains functional

### **New Analytics Opportunities:**
- Track personalized vs default presentation usage
- Measure engagement differences between custom content
- Monitor conversion rates for personalized presentations

## 🚀 Future Enhancements

### **Planned Features:**
1. **Slide Editor** - Visual editor for customizing slide content
2. **Templates** - Pre-built presentation templates
3. **Bulk Operations** - Create presentations for multiple users
4. **A/B Testing** - Test different content variations
5. **Analytics Dashboard** - Dedicated analytics for personalized presentations
6. **Content Library** - Reusable content components

### **Advanced Customization:**
1. **Dynamic Content** - Real-time content updates
2. **Conditional Logic** - Show/hide content based on user data
3. **Multi-language Support** - Localized presentations
4. **Rich Media** - Support for videos, animations, and interactive elements

## 🐛 Troubleshooting

### **Common Issues:**

#### **1. User sees default presentation instead of personalized**
- Check if personalized presentation exists for the user
- Verify presentation is marked as active
- Check user permissions and authentication

#### **2. Admin can't create personalized presentation**
- Ensure user exists in the system
- Check admin permissions
- Verify no active presentation already exists for the user

#### **3. Content not displaying correctly**
- Validate JSON structure of slide content
- Check for required fields in content objects
- Verify content type is supported

### **Debug Steps:**
1. **Check Database** - Verify personalized_presentations table exists
2. **Check API** - Test endpoints with Postman or similar tool
3. **Check Frontend** - Verify components are properly imported
4. **Check Logs** - Review backend and frontend console logs

## 📝 Example Usage

### **Creating a Personalized Presentation:**

```javascript
// Admin creates personalized presentation
const presentationData = {
  user_id: 1,
  title: "Custom EventForce Demo",
  subtitle: "Tailored for Enterprise Client",
  slides: [
    {
      id: 1,
      title: "Welcome to Your Custom Demo",
      subtitle: "Personalized for Your Business",
      content: {
        type: "welcome",
        features: [
          {
            icon: "🎯",
            title: "Your Custom Feature",
            desc: "Tailored specifically for your business needs"
          }
        ]
      }
    }
  ],
  is_active: true
};

// API call
await personalizedPresentationsAPI.create(presentationData);
```

### **User Views Personalized Content:**

```javascript
// User automatically gets personalized content
const userPresentation = await personalizedPresentationsAPI.getByUserId(userId);

// If no personalized presentation exists, fallback to default
if (!userPresentation) {
  // Show default presentation
}
```

## 🎉 Benefits

### **For Admins:**
- **Targeted Messaging** - Deliver specific content to different users
- **Better Conversion** - Increase engagement with personalized content
- **Flexible Management** - Easy creation and management of custom presentations
- **Analytics Insights** - Track performance of personalized content

### **For Users:**
- **Relevant Experience** - See content tailored to their needs
- **Better Engagement** - More meaningful and targeted information
- **Professional Feel** - Personalized experience enhances credibility
- **Clear Next Steps** - Customized call-to-action and contact information

## 🔗 Related Files

### **Backend:**
- `backend/models.py` - PersonalizedPresentation model
- `backend/schemas.py` - API schemas for personalized presentations
- `backend/routes/forms.py` - API endpoints
- `backend/alembic/versions/add_personalized_presentations.py` - Database migration

### **Frontend:**
- `frontend/lib/api.ts` - API client functions
- `frontend/components/PersonalizedPresentationsManager.tsx` - Admin interface
- `frontend/components/PersonalizedPresentationViewer.tsx` - User viewer
- `frontend/app/admin/page.tsx` - Admin dashboard integration
- `frontend/app/presentation/page.tsx` - User presentation page

---

## 🚀 Quick Start

1. **Start the application:**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

2. **Access admin dashboard:**
   - URL: http://localhost:3000/admin
   - Login: admin@example.com / admin123

3. **Create personalized presentation:**
   - Go to "Personalized Presentations" tab
   - Click "Create Presentation"
   - Select user and customize content

4. **Test user experience:**
   - Login as the selected user
   - Navigate to presentation page
   - View personalized content

---

**🎯 The Personalized Presentations feature is now fully implemented and ready for use!** 