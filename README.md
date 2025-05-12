
![logo(1)](https://github.com/user-attachments/assets/bc411088-f74e-4d5b-b518-63d9cbd06aba)

# The Daily Poet

A platform for poets and writers to share their creative work with the world. The Daily Poet provides a beautiful, distraction-free environment for sharing poetry, stories, and spoken word recordings.

![The Daily Poet](https://i.imgur.com/placeholder.jpg)

## Features

- **Beautiful Writing Experience**: Clean, distraction-free interface for sharing poetry and stories
- **Audio Recordings**: Add depth to your work with audio recordings of your readings
- **Social Interactions**: Like, comment, and repost works that move you
- **Collections**: Organize posts into custom collections
- **Search & Discovery**: Find new voices and content through robust search functionality
- **User Profiles**: Customize your profile and follow other writers
- **Analytics**: Track engagement and performance of your posts
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- Lucide React (icons)

### Backend
- Ruby on Rails
- MySQL
- Active Storage
- Devise (authentication)

## Local Setup

### Prerequisites
- Node.js (v16+)
- Ruby (v3.0+)
- Rails (v7.0+)
- MySQL

### Backend Setup

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/daily-poet.git
cd daily-poet/backend
\`\`\`

2. Install dependencies
\`\`\`bash
bundle install
\`\`\`

3. Configure database
\`\`\`bash
# Edit config/database.yml with your MySQL credentials

# Create and migrate database
rails db:create
rails db:migrate

# Optional: Seed database with sample data
rails db:seed
\`\`\`

4. Start the Rails server
\`\`\`bash
rails s -p 3000
\`\`\`

### Frontend Setup

1. Navigate to the frontend directory
\`\`\`bash
cd ../frontend
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Configure API endpoint
\`\`\`bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:3000/api/v1" > .env
\`\`\`

4. Start the development server
\`\`\`bash
npm start
# or
yarn start
\`\`\`

5. Access the application at `http://localhost:5173`

## API Documentation

The API follows RESTful conventions. Main endpoints include:

- `/api/v1/posts` - Post management
- `/api/v1/users` - User management
- `/api/v1/comments` - Comment management
- `/api/v1/collections` - Collection management
- `/api/v1/search` - Search functionality
- `/api/v1/analytics` - User analytics

## Deployment

### Backend
The Rails application can be deployed to Heroku, Railway, or any other platform that supports Ruby on Rails.

\`\`\`bash
# Example for Heroku
heroku create daily-poet-api
git subtree push --prefix backend heroku main
heroku run rails db:migrate
\`\`\`

### Frontend
The React application can be deployed to Vercel, Netlify, or any other static site hosting service.

\`\`\`bash
# Build the application
cd frontend
npm run build

# Deploy to Vercel
vercel
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Designed and developed by [Allen Amaya](https://ahlee.dev)

---

© 2025 The Daily Poet. All rights reserved.
