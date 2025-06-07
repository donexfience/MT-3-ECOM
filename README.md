# Product Management System

A modern React-based product management system with role-based access control, featuring separate dashboards for administrators and users.

## 🚀 Features

### Authentication & Authorization
- **Secure Authentication**: Sign up and sign in functionality
- **Role-Based Access Control**: Separate access levels for admins and users
- **Protected Routes**: Route protection based on user roles and authentication status
- **Guest Route Protection**: Prevents authenticated users from accessing auth pages

### Admin Features
- **Product Management**: Full CRUD operations for products
- **Product Details**: Detailed product information and management
- **Search Functionality**: Real-time product search capabilities
- **Admin Dashboard**: Centralized admin control panel

### User Features
- **Product Browsing**: Browse available products
- **Product Details**: View detailed product information
- **User Profile**: Personal profile management
- **Search Products**: Search through available products

### Technical Features
- **Responsive Design**: Mobile-first responsive layout
- **Toast Notifications**: User-friendly notifications system
- **404 Error Handling**: Custom not found page
- **Modern UI**: Clean and intuitive user interface

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+
- **Routing**: React Router DOM
- **Styling**: CSS3 with custom components
- **Notifications**: React Fox Toast
- **State Management**: React Hooks (useState, useContext)
- **Authentication**: JWT-based authentication system

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
├── layouts/             # Layout components
│   ├── AdminLayout.js   # Admin dashboard layout
│   └── UserLayout.js    # User dashboard layout
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   │   ├── Signup.js   # User registration
│   │   └── SignIn.js   # User login
│   ├── admin/          # Admin-only pages
│   │   ├── Product.js  # Product management
│   │   └── ProductDetails.js
│   ├── user/           # User pages
│   │   ├── Product.js  # Product browsing
│   │   └── ProductDetails.js
│   ├── profile/        # User profile
│   │   └── UserProfile.js
│   └── 404/            # Error pages
│       └── NotFound.js
├── protected/          # Route protection components
│   ├── ProtectHome.js  # Home route protection
│   ├── GuestRoute.js   # Guest-only routes
│   └── protectedRoute.js # Role-based protection
├── App.js              # Main application component
├── App.css             # Global styles
└── index.js            # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

## 🔐 Authentication & Roles

### User Roles

- **Admin**: Full access to product management, user management, and system configuration
- **User**: Limited access to product browsing and profile management

### Route Protection

- **Public Routes**: `/sign-up`, `/sign-in`
- **Admin Routes**: `/home/admin/*` (requires admin role)
- **User Routes**: `/home/user/*` (requires user role)
- **Protected Routes**: All routes under `/home` require authentication

## 🎯 Usage

### For Administrators

1. **Sign In**: Use admin credentials to access the system
2. **Product Management**: 
   - Navigate to `/home/admin/product` to manage products
   - Use search functionality to find specific products
   - Click on products to view/edit details
3. **Dashboard**: Access admin-specific features and analytics

### For Users

1. **Sign Up/Sign In**: Create account or log in
2. **Browse Products**: 
   - Navigate to `/home/user/product` to browse available products
   - Use search to find specific items
   - Click on products to view details
3. **Profile Management**: Update personal information in the profile section

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env

frontend

VITE_API_URL=http://localhost:3000/api
VITE_BACKEND_URL_IMAGE =http://localhost:3000/uploads


backend

JWT_ACCESS_SECRET=secretedevde
JWT_REFRESH_SECRET=secretedevde
JWT_USRID_SECRET =secretedevde
PORT =3000
MONGO_URI =evdeenved

```

### Custom Configuration

- **Toast Settings**: Modify toast notifications in `App.js`
- **Route Configuration**: Update routes in `App.js`
- **Styling**: Customize styles in `App.css` and component-specific CSS files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Search functionality is currently client-side only

## 🚀 Future Enhancements

- [ ] Advanced filtering and sorting
- [ ] Bulk product operations
- [ ] Export functionality
- [ ] Mobile app version

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Made with ❤️ using React**
