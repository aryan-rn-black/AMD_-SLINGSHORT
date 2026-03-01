# 🎯 COMPLETE PROMPT TO RECREATE IN-FOLIO

## Project Overview

Build a professional networking web application called **"In-Folio"** using React, TypeScript, and Tailwind CSS. The app features **TWO completely separate account environments** - a Professional Mode (LinkedIn-style for career networking) and a Market Mode (local job marketplace), each with their own profiles, posts, and content.

---

## 🏗️ Technical Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **UI Components**: Radix UI (Tabs, Dialog, Switch)
- **Build Tool**: Vite
- **Image Handling**: Unsplash for placeholder images

---

## 📱 Core Application Structure

### Main App (App.tsx)
Create a main App component with:
- State management for 5 screens: `dashboard`, `marketplace`, `profile`, `jobs`, `gigs`
- **Two completely separate user profiles**:
  - **Professional Mode**: Sarah Chen (career professional)
  - **Market Mode**: Aryan Patidar (local business user)
- Each mode has its own:
  - Profile photo and banner image
  - Personal info (name, DOB, email, phone)
  - Posts array (separate feeds)
- Hamburger menu drawer for navigation (fixed top-left, purple background)
- Profile mode tracking to determine which profile to display
- Mode toggle functionality (switches entire environment)

### Dual Profile System Details
**Professional Profile (Sarah Chen)**:
- Default photo: Professional woman (use Unsplash)
- Default banner: Tech/corporate background
- Email: sarah.chen@example.com
- DOB: 1995-06-15
- Phone: +1 (555) 123-4567

**Market Profile (Aryan Patidar)**:
- Default photo: Young professional man (use Unsplash)
- Default banner: Colorful/vibrant background
- Email: aryan.patidar@example.com
- DOB: 1998-03-22
- Phone: +91 98765 43210

---

## 🎨 SCREEN 1: Professional Dashboard (3-Column Layout)

### Layout Structure
Create a **3-column layout** with:
- **Left Sidebar** (25% width)
- **Center Feed** (50% width)
- **Right Sidebar** (25% width)

### Top Navigation (Sticky)
- Logo on the left (use figma:asset or placeholder)
- Search bar (full-width, gray background): "Search for jobs, people, or projects..."
- Navigation icons: Home, Jobs, Messages, Notifications (purple when active)
- Profile picture (clickable, navigates to profile)
- **Mode Toggle Switch**: Professional ↔ Local (black when checked, gray when unchecked)
  - Label shows "Professional" or "Local" based on toggle state
  - Switches between dashboard and marketplace

### Left Sidebar
**User Profile Card**:
- Large profile photo (circular, clickable to profile)
- User name (Sarah Chen)
- Subtitle: "Senior Full Stack Developer"
- Location: "San Francisco, CA"
- University badge: "MIT" with purple icon

**Quick Stats Section**:
- "Profile views this week": 245
- "Post impressions": 1,234

**Helpful Links**:
- "My Network" 
- "My Projects"
- "Saved Jobs"
- "Settings"
(All with purple hover effect)

### Center Feed
**Create Post Section**:
- "What's on your mind?" input area
- User avatar on left
- Plus icon button to open create post dialog
- Create Post Dialog includes:
  - Large text area
  - Image upload button (optional)
  - "Post" button (purple, bottom-right)

**Posts Feed**:
Display posts with:
- Author avatar, name, tag (e.g., #Hiring, #TechUpdate)
- Post content text
- Optional image
- Timestamp (e.g., "2h ago")
- Engagement buttons: Comment, Bookmark icons with counts

**Mock Posts** (at least 3):
1. Sarah Chen - #Hiring - Looking for Senior React Developer post with tech image
2. Alex Kumar - #TechUpdate - Design system announcement with UI image
3. Maya Patel - #ProjectShowcase - E-commerce project showcase with app screenshot

### Right Sidebar
**"Jobs for You" Card**:
- Purple gradient background
- "15 new jobs match your profile"
- "View All Jobs" button (purple, full-width)
- Clicking navigates to Jobs Dashboard

**"Side Quests" Section** (4+ items):
- Title: "Need a React Dev for the weekend"
- Description: "Quick project: Build a landing page..."
- Duration: "2 days"
- Tags: ["React", "Framer Motion"]
- Hover effect: light purple background

Additional quests:
- UI/UX Review Session
- API Integration Help  
- Code Review Partner

---

## 🎨 SCREEN 2: Jobs Dashboard

### Header
- Same navigation as dashboard
- Back button (left arrow) to return to Professional Dashboard
- Title: "Jobs for You"
- Mode toggle (same as dashboard)

### Left Sidebar - Filters
**Search & Location**:
- Job title search input
- Location search input with map pin icon

**Job Type** (checkboxes):
- Full-time
- Part-time
- Contract
- Internship

**Experience Level** (checkboxes):
- Entry Level
- Mid Level
- Senior Level
- Executive

**Salary Range Slider**:
- Min: $0, Max: $200k
- Dual-handle slider
- Display selected range above

**Date Posted** (radio buttons):
- Last 24 hours
- Last week
- Last month
- Anytime

"Apply Filters" button (purple, full-width)

### Main Content - Job Listings
Display job cards (8-10 jobs):

Each card shows:
- Company logo (circular)
- Job title (bold, large)
- Company name
- Location with pin icon
- Salary range
- Job type badge (Full-time/Part-time)
- Short description
- Posted time (e.g., "Posted 2 days ago")
- "Apply Now" button (purple)

**Example Jobs**:
1. Senior Frontend Developer at TechCorp - $120k-150k - Remote
2. Product Designer at StartupXYZ - $90k-120k - San Francisco
3. Full Stack Engineer at DataFlow - $110k-140k - New York
4. UX Researcher at DesignHub - $80k-100k - Remote
5. Backend Developer at CloudTech - $100k-130k - Seattle
6. DevOps Engineer at ServerPro - $115k-145k - Austin
7. Mobile Developer at AppWorks - $95k-125k - Los Angeles
8. Data Scientist at AnalyticsCo - $130k-160k - Boston

---

## 🎨 SCREEN 3: Local Marketplace (Market Mode)

### Design
**Visual Style**: Clean, modern social feed (like Twitter/X)
**Color Scheme**: Purple accents, white background

### Top Navigation (Same structure as Professional)
- Logo, Search bar, Icons, Profile
- **Mode Toggle**: Shows "Local" when in Market Mode
- Toggle switches to Professional Dashboard when clicked

### Main Feed (Single Column, Centered)
**Create Post Section**:
- Aryan Patidar's avatar
- "Share something with your community..." input
- Opens Marketplace Create Post dialog
- Dialog includes image upload option

**Posts Feed**:
Display posts with full engagement features:
- Author info (name, avatar, tag)
- Post content
- Optional image
- Timestamp
- **Engagement bar**:
  - Heart icon (like) with count - toggleable
  - Comment icon with count
  - Bookmark icon
- **Comments section** (expandable):
  - Show existing comments
  - Comment input field
  - Send button

**Mock Posts** (3+ posts):
1. Rajesh Kumar - #Hiring - "Need delivery partner for cloud kitchen" - restaurant image
2. Priya Sharma - #LocalBusiness - "Just opened boutique, hiring sales assistant" - store image
3. Amit Verma - #QuickGig - "Urgent furniture loading/unloading, ₹800/3hrs" - furniture image

### Right Sidebar
**"Quick Gigs Nearby" Card**:
- Purple/pink gradient background
- "28 new gigs in your area"
- "Explore Gigs" button (purple)
- Clicking navigates to Gigs Marketplace

**WhatsApp Integration** (for each post):
- Green WhatsApp button
- "Contact via WhatsApp" text
- Opens WhatsApp link (mock URL)

---

## 🎨 SCREEN 4: Gigs Marketplace

### Design Style
**Background**: Purple to pink gradient (vibrant, eye-catching)
**Feel**: More casual and local than Jobs Dashboard

### Top Navigation
- Same structure, but with gradient background
- "Gigs" title
- Back button to Local Marketplace

### Left Sidebar - Filter Panel
**White card with categories** (expandable):

**Job Categories** (expandable):
- Delivery & Logistics (5)
- Food & Hospitality (8)
- Retail & Sales (12)
- Warehouse & Labor (6)
- Security & Safety (3)
- Expand/collapse icon

**Location** (expandable):
- Checkboxes for areas:
  - Raipur Center
  - Sector 21
  - Marine Drive
  - Industrial Area
  - Downtown

**Pay Range Slider**:
- ₹0 to ₹50,000/month
- Dual-handle slider
- Show selected range

**Job Type** (expandable):
- Full-time
- Part-time
- Freelance
- Daily Wage

**"View Results" button** (purple, full-width at bottom)

### Main Content - Gig Cards
Display gig cards (6-8 gigs):

Each card includes:
- Gig title (bold)
- Employer name with avatar
- Location with pin icon
- Salary (e.g., "₹300-500/day")
- Job type badge
- Description text
- Posted time
- Tags (pill-shaped badges)
- Applicants count
- "Apply Now" button (purple)
- "Contact" button (outline)

**Example Gigs**:
1. Delivery Driver - QuickBite Restaurant - ₹300-500/day - Part-time
2. Sales Associate - Style Hub Boutique - ₹12k-15k/month - Full-time
3. Barista - Brew & Beans Cafe - ₹10k-14k/month - Full-time
4. Warehouse Associate - Metro Logistics - ₹13k-16k/month
5. Line Cook - Spice Garden Restaurant - ₹15k-20k/month

---

## 🎨 SCREEN 5: Profile Pages (TWO VERSIONS)

### Common Layout (Both Profiles)

**Top Section**:
- Banner image (full-width, editable with camera icon)
- Profile photo (large, circular, overlapping banner)
- Camera icon overlay on profile photo (edit functionality)
- Name (large, bold)
- Subtitle/profession
- Location
- Edit profile button

**Tab Navigation**:
- About
- Projects
- Activity
- Chat

### Professional Profile (Sarah Chen)

**About Tab**:
- Personal Information card (editable):
  - Name (editable inline)
  - Date of Birth (date picker)
  - Email (editable)
  - Phone (editable)
  - Save button when editing
- Bio section
- Skills tags
- Experience timeline

**Projects Tab** (Pinterest-style grid):
- Masonry grid layout (2-3 columns)
- Project cards with:
  - Thumbnail image
  - Project title
  - Platform badge (GitHub/Figma/Blog/Website)
  - Hover effect: slight scale and shadow

**Example Projects** (6+ projects):
1. E-Commerce Dashboard - GitHub - tech dashboard image
2. Mobile App Design System - Figma - UI design image
3. React Performance Tips - Blog - blog article image
4. Portfolio Website v3 - Website - website screenshot
5. Open Source React Library - GitHub - code image
6. SaaS Landing Page - Figma - landing page design

**Activity Tab**:
- Recent posts
- Likes and comments
- Project updates

**Chat Tab**:
- Message list (3-4 mock messages):
  - Avatar, name, message preview
  - Timestamp
  - Unread indicator (optional)
- Message detail view:
  - Chat history
  - Message input field
  - Send button (purple)

### Market Profile (Aryan Patidar)

**Similar structure but with**:
- More casual tone
- Local business focus
- Projects showcase local work
- Different color accent (can use purple/pink gradient elements)

**Projects might include**:
1. Food Delivery App
2. Local Store Website
3. Event Photography Portfolio
4. Freelance Work Samples

---

## 🎯 Navigation System

### Hamburger Menu (Profile Drawer)
**Fixed button**: Top-left corner, purple background, menu icon
**Drawer slides from left** when clicked

**Drawer Contents**:
- Profile section (top):
  - Large profile photo (clickable to profile)
  - User name (clickable to profile)
  - Subtitle text
  - Location
  - Verification badge icon
  - University/Company badge

**Navigation Links**:
- Local Marketplace (home icon)
- Gigs (briefcase icon)
- Professional Dashboard (briefcase icon)
- Profile (user icon)

**Bottom Section**:
- Logout button (red text, logout icon)

**Drawer Behavior**:
- Opens with overlay (black, 50% opacity)
- Clicking overlay closes drawer
- X button in top-right closes drawer
- Smooth slide animation (300ms)

### Profile Navigation
**Clicking profile photo anywhere**:
- Navigates to profile page
- Shows correct profile based on current mode:
  - In Professional/Jobs → Sarah Chen profile
  - In Marketplace/Gigs → Aryan Patidar profile

---

## 🎨 Design Specifications

### Colors
- **Primary Purple**: #9333ea (buttons, active states)
- **Purple Hover**: #7e22ce
- **Gray Background**: #f9fafb
- **Border Gray**: #e5e7eb
- **Text Primary**: #111827
- **Text Secondary**: #6b7280

### Typography
- Font: System fonts (use Tailwind defaults)
- Headings: Bold, larger sizes
- Body: Regular weight, readable size
- Use Tailwind text classes

### Components
- **Buttons**: Rounded corners, purple background, white text, hover effect
- **Cards**: White background, subtle shadow, rounded corners, border
- **Badges**: Small, rounded pill shape, colored backgrounds
- **Avatars**: Circular, with fallback to initials
- **Inputs**: Gray background, border, rounded, focus ring (purple)

### Responsive Design
- Mobile: Single column, stack sidebars below
- Tablet: Adjust column widths
- Desktop: Full 3-column layout where applicable
- Use Tailwind responsive classes

---

## 🔧 Key Features & Interactions

### Post Creation
1. Click "Create Post" or plus icon
2. Dialog opens with:
   - Text area (multiline)
   - Image upload button (optional)
   - Preview of image if added
   - Cancel and Post buttons
3. On submit:
   - Add post to beginning of feed
   - Close dialog
   - Show "Just now" timestamp

### Like/Unlike Posts
- Heart icon clickable
- Toggle between filled/outline
- Increment/decrement count
- Color changes to red when liked

### Comments
- Click comment icon to expand comments section
- Show existing comments (author, avatar, text, time)
- Input field to add new comment
- Send button
- Add comment to post's comments array

### Image Uploads (Mock)
- File input hidden
- Click to select image
- Preview selected image
- Use Unsplash URLs for demo
- In real app, would upload to server

### Profile Editing
1. Click edit icon
2. Fields become editable
3. Show save/cancel buttons
4. On save, update profile state
5. Exit edit mode

### Mode Switching
- Toggle switch in header
- **Professional Mode** (toggle ON/checked):
  - Black/dark background on switch
  - Shows Professional Dashboard
  - Sarah Chen's profile
  - Corporate color scheme
- **Market/Local Mode** (toggle OFF/unchecked):
  - Gray background on switch
  - Shows Local Marketplace
  - Aryan Patidar's profile
  - More colorful, casual design

### Navigation Flow
- Dashboard ↔ Jobs ↔ Profile (Professional Mode)
- Marketplace ↔ Gigs ↔ Profile (Market Mode)
- Hamburger menu accessible from all screens
- Back buttons on Jobs and Gigs screens

---

## 📦 Required Components

Create these reusable UI components:

### From Radix UI
- `<Tabs>` - For profile page tabs
- `<Dialog>` - For create post modals
- `<Switch>` - For mode toggle
- `<Avatar>` - For profile pictures
- `<Badge>` - For tags and status
- `<Card>` - For content sections

### Custom Components
- `<ProfessionalDashboard>` - Main professional screen
- `<LocalMarketplace>` - Market mode feed
- `<JobsDashboard>` - Jobs listing screen
- `<GigsMarketplace>` - Gigs listing screen
- `<ProfessionalProfile>` - Sarah's profile
- `<MarketProfile>` - Aryan's profile
- `<ProfileDrawer>` - Hamburger menu drawer
- `<ProfessionalCreatePost>` - Create post for professional
- `<MarketplaceCreatePost>` - Create post for marketplace
- `<ImageWithFallback>` - Image component with loading states

---

## 🗂️ File Structure

```
src/
├── main.tsx                          # React entry point
├── app/
│   ├── App.tsx                       # Main app component with routing logic
│   └── components/
│       ├── professional-dashboard.tsx
│       ├── local-marketplace.tsx
│       ├── jobs-dashboard.tsx
│       ├── gigs-marketplace.tsx
│       ├── professional-profile.tsx
│       ├── market-profile.tsx
│       ├── profile-drawer.tsx
│       ├── professional-create-post.tsx
│       ├── marketplace-create-post.tsx
│       ├── figma/
│       │   └── ImageWithFallback.tsx
│       └── ui/
│           ├── avatar.tsx
│           ├── badge.tsx
│           ├── button.tsx
│           ├── card.tsx
│           ├── dialog.tsx
│           ├── input.tsx
│           ├── label.tsx
│           ├── switch.tsx
│           └── tabs.tsx
└── styles/
    ├── index.css
    ├── tailwind.css
    ├── theme.css
    └── fonts.css
```

---

## 🎯 State Management

### App-level State (in App.tsx)
```typescript
// Screen navigation
const [activeScreen, setActiveScreen] = useState<'dashboard' | 'marketplace' | 'profile' | 'jobs' | 'gigs'>('marketplace');

// Drawer
const [isDrawerOpen, setIsDrawerOpen] = useState(false);

// Profile mode tracking
const [profileMode, setProfileMode] = useState<'professional' | 'market'>('professional');

// Professional Mode data
const [professionalPosts, setProfessionalPosts] = useState<Post[]>([]);
const [profProfilePhoto, setProfProfilePhoto] = useState(string);
const [profBannerImage, setProfBannerImage] = useState(string);
const [profPersonalInfo, setProfPersonalInfo] = useState(object);

// Market Mode data (completely separate)
const [marketplacePosts, setMarketplacePosts] = useState<Post[]>([]);
const [marketProfilePhoto, setMarketProfilePhoto] = useState(string);
const [marketBannerImage, setMarketBannerImage] = useState(string);
const [marketPersonalInfo, setMarketPersonalInfo] = useState(object);
```

### Component-level State
- Dialog open/close states
- Form input values
- Filter selections
- Comment expansion states
- Like/unlike toggles

---

## 🖼️ Images & Assets

### Use Unsplash for all images:
- Profile photos: Professional portraits
- Banner images: Tech/business scenes or vibrant backgrounds
- Post images: Relevant to content (tech, food, retail, etc.)
- Project thumbnails: UI designs, code screenshots, websites
- Company logos: Generic business photos (circular crop)
- Gig images: Restaurant, retail, warehouse scenes

### Logo
- Use `figma:asset` scheme for imported logo
- Or create simple text-based logo: "IF" in circle
- Purple gradient background

---

## 🎭 Mock Data Examples

### Post Interface
```typescript
interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  tag: string; // #Hiring, #TechUpdate, etc.
  content: string;
  image?: string;
  timestamp: string;
  replies: number;
  bookmarks: number;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}
```

### Comment Interface
```typescript
interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}
```

### Job Interface
```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  type: string; // Full-time, Part-time, etc.
  description: string;
  postedDate: string;
}
```

### Gig Interface
```typescript
interface Gig {
  id: string;
  title: string;
  employer: string;
  employerAvatar: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  postedTime: string;
  tags: string[];
  applicants: number;
}
```

---

## ✅ Key Implementation Details

### Mode Toggle Logic
```typescript
const handleModeToggle = (isProfessional: boolean) => {
  if (isProfessional) {
    setActiveScreen('dashboard');
  } else {
    setActiveScreen('marketplace');
  }
};
```

### Profile Navigation Logic
```typescript
const handleNavigateToProfile = () => {
  // Determine which profile to show based on current screen
  if (activeScreen === 'marketplace' || activeScreen === 'gigs') {
    setProfileMode('market');
  } else {
    setProfileMode('professional');
  }
  setActiveScreen('profile');
};
```

### Current Mode Determination
```typescript
const currentMode = activeScreen === 'marketplace' || activeScreen === 'gigs' ? 'market' : 
                    activeScreen === 'profile' ? profileMode : 
                    'professional';
```

---

## 🎨 Special Design Requirements

### Toggle Switch (Custom CSS)
- Width: 32px
- Height: 18px
- Border radius: Full (pill shape)
- Background: Gray when off, Black when on
- Circle slider: 16x16px, white, smooth transition
- Transition duration: 300ms

### Scrollbar Styling
- Width: 8px
- Track: Light gray (#f1f1f1)
- Thumb: Purple (#9333ea), rounded
- Hover: Darker purple (#7e22ce)

### Animations
- Drawer slide: 300ms ease-in-out
- Button hover: Scale 1.02, shadow increase
- Card hover: Slight lift (shadow)
- Like animation: Scale bounce
- Smooth transitions on all interactive elements

---

## 🔌 Integration Points (Future)

### WhatsApp Integration
- Add WhatsApp button to marketplace posts
- Generate WhatsApp link with pre-filled message
- Format: `https://wa.me/phone?text=message`

### Image Upload
- Currently mock with URL input
- Future: Integrate with file upload API
- Use Unsplash URLs for demo

### Authentication
- Currently no auth
- Future: Add login/signup
- JWT token storage
- Protected routes

---

## 📝 Additional Requirements

### Accessibility
- Use semantic HTML
- Add ARIA labels to buttons
- Keyboard navigation support
- Focus indicators visible

### Performance
- Lazy load images
- Memoize expensive components
- Virtual scrolling for long lists (optional)

### Code Quality
- TypeScript for type safety
- Component props clearly defined
- Reusable utility functions
- Clean, readable code structure

---

## 🚀 Getting Started

1. Set up React + TypeScript + Vite project
2. Install dependencies:
   - react, react-dom
   - typescript
   - tailwindcss
   - lucide-react
   - @radix-ui/react-* (tabs, dialog, switch)
   - class-variance-authority, clsx, tailwind-merge
3. Configure Tailwind CSS v4
4. Create component structure
5. Implement App.tsx with state management
6. Build each screen component
7. Add UI components from Radix
8. Implement interactions (like, comment, create post)
9. Add navigation logic
10. Test all user flows
11. Add responsive design
12. Polish animations and transitions

---

## 🎯 Success Criteria

The app should:
- ✅ Have 5 distinct screens working
- ✅ Support two completely separate user profiles
- ✅ Allow mode switching via toggle
- ✅ Show different content per mode
- ✅ Enable post creation with images
- ✅ Support like/comment functionality
- ✅ Have working navigation (drawer, back buttons)
- ✅ Display profile pages with editable fields
- ✅ Show Pinterest-style project grid
- ✅ Include filter functionality (jobs/gigs)
- ✅ Be fully responsive
- ✅ Have smooth animations
- ✅ Use consistent design system

---

## 📖 Notes

- This is a **frontend-only demo** - no backend required
- All data stored in component state (resets on refresh)
- Use localStorage if persistence needed
- Mock all API calls
- Focus on UI/UX and interactions
- Make it visually impressive and professional
- Ensure smooth user experience across all screens
- The two modes should feel like completely different apps

---

**END OF PROMPT**

---

## Quick Summary

Build In-Folio: A dual-mode professional networking app with:
- **Professional Mode** (Sarah Chen): LinkedIn-style dashboard, jobs board, portfolio
- **Market Mode** (Aryan Patidar): Local marketplace, gigs, community feed
- 5 screens total, responsive design, full CRUD for posts
- React + TypeScript + Tailwind CSS + Radix UI
- Completely separate profiles and data per mode
- Beautiful UI with smooth animations
