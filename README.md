# Next.js + Supabase VENTRY Auth System 🔐

A modern authentication system built with Next.js and Supabase featuring email/password login, social provider authentication, and profile management.

## ✨ Features

- 📧 Email/password authentication
- 🔄 Social login (Google, GitHub)
- 🔒 Protected routes
- 👤 User profile management
- 📱 Responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/krishanb4/ventry-signin.git
   cd ventry-signin
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with:

   ```
   # Invitation code for users to register
   INVITE_CODE=your_invite_code
   
   # Next.js public site URL
   NEXT_PUBLIC_SITE_URL=your_site_url
   
   # Supabase URLs
   SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   
   # Supabase API keys
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_JWT_SECRET=your_supabase_jwt_secret
   
   # PostgreSQL connection details
   POSTGRES_URL=your_postgres_connection_string
   POSTGRES_PRISMA_URL=your_postgres_prisma_connection_string
   POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DATABASE=your_postgres_database
   POSTGRES_HOST=your_postgres_host
   ```

### Supabase Setup

Set up your Supabase database with these RLS policies:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can read any profile"
ON profiles FOR SELECT TO authenticated
USING (true);
```

### Running the App

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/
├── app/                # Next.js app router
│   ├── actions/        # Server actions
│   ├── auth/           # Auth routes
│   └── dashboard/      # Protected routes
├── components/         # UI components
├── utils/
│   └── supabase/       # Supabase client setup
└── public/             # Static assets
```

## 🔐 Authentication Flow

### Sign Up
1. User registers with email/password
2. Verification email sent
3. User verifies email
4. Profile created in database

### Sign In
1. User signs in with email/password or social provider
2. Session created
3. Redirected to dashboard

## 🧰 Customization

- **UI**: Modify components in `/components`
- **Providers**: Add more social providers in Supabase dashboard
- **Profile**: Extend profile schema in Supabase

## 🚀 Deployment

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Deploy to Vercel, Netlify, or any platform supporting Next.js.

## ⚠️ Troubleshooting

- **Auth Issues**: Check Supabase URL and keys
- **Database Access**: Verify RLS policies
- **API Errors**: Check network logs and CORS settings

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.io/docs)
- [Supabase Auth Guide](https://supabase.io/docs/guides/auth)