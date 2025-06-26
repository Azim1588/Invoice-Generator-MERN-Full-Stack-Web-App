# 🧾 Invoice Generator Pro

A modern, full-stack invoice generation application built with React, Node.js, and MongoDB. Create professional invoices, manage customers, and streamline your billing process.

![Invoice Generator Pro](https://img.shields.io/badge/Invoice-Generator%20Pro-orange)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue)

## ✨ Features

- 🎨 **Beautiful Templates** - Professional invoice designs
- 👥 **Customer Management** - Store and manage client information
- 📊 **Business Profiles** - Customize your company branding
- 📄 **PDF Generation** - Download invoices as PDF files
- 🔐 **User Authentication** - Secure login and registration
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - Instant data synchronization

## 🚀 Live Demo

- **Frontend:** [Coming Soon]
- **Backend API:** [Coming Soon]

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **CSS3** - Styling with CSS variables

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **PDFKit** - PDF generation
- **Multer** - File uploads

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Clone the Repository

```bash
git clone https://github.com/your-username/invoice-generator-pro.git
cd invoice-generator-pro
```

### Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your backend URL
VITE_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Application

### Development Mode

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

**Frontend:**

```bash
cd frontend
npm run build
```

**Backend:**

```bash
cd backend
npm start
```

## 📁 Project Structure

```
invoice-generator-pro/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── businessProfileController.js
│   │   ├── customerController.js
│   │   └── invoiceController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── BusinessProfile.js
│   │   ├── Customer.js
│   │   ├── Invoice.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── businessProfile.js
│   │   ├── customers.js
│   │   └── invoices.js
│   ├── services/
│   │   └── pdfService.js
│   ├── uploads/
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── BusinessProfile.jsx
│   │   │   ├── CreateCustomer.jsx
│   │   │   ├── CreateInvoice.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditInvoice.jsx
│   │   │   ├── InvoiceDetail.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Customers

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Invoices

- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/pdf` - Download PDF

### Business Profile

- `GET /api/business-profile` - Get business profile
- `PUT /api/business-profile` - Update business profile
- `POST /api/business-profile/logo` - Upload logo

## 🎨 Features Overview

### Dashboard

- Overview of invoices and customers
- Quick statistics and recent activity
- Quick actions for common tasks

### Invoice Management

- Create professional invoices
- Multiple invoice templates
- PDF download functionality
- Invoice status tracking

### Customer Management

- Store customer information
- Customer history and invoices
- Contact details management

### Business Profile

- Company information setup
- Logo upload and management
- Branding customization
- Invoice settings

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 🌙 Theme Support

- Light and dark mode toggle
- Persistent theme preference
- Smooth transitions
- Responsive design

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Cross-browser compatibility

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options:

- **Render** (Backend) + **Netlify** (Frontend)
- **Railway** (Full-stack)
- **Heroku** (Backend) + **Vercel** (Frontend)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide React](https://lucide.dev/) - Icons

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation
- Review the deployment guide

## 🎯 Roadmap

- [ ] Multi-currency support
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Webhook support

---

**Made with ❤️ by [Your Name]**
