// admin.js
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/sequelize'
import { Product, Category } from '../models/product.js'
import dotenv from 'dotenv'

dotenv.config()

AdminJS.registerAdapter({ Database, Resource })

const adminJs = new AdminJS({
  rootPath: '/admin',
  resources: [
    { resource: Product },
    { resource: Category }
  ],
  branding: {
    companyName: 'GuisedStore Admin',
    softwareBrothers: false,
  },
})

// ✅ Add simple hardcoded or env-based login
const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'password',
}

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN
    }
    return null
  },
  cookieName: 'adminjs',
  cookiePassword: process.env.SESSION_SECRET || 'supersecret',
}, null, {
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'supersecret',
})

export default router