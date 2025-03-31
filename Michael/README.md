# QuicRef - Microtask Platform

QuicRef is a task-based microtask platform that enables users to create tasks, complete tasks, and earn money through both task completion and referrals.

## Features

- User registration and authentication with Firebase
- Task creation and management
- Task submission and review system
- Wallet functionality with deposit and withdrawal options
- Referral system with bonuses
- Real-time notifications
- Mobile-responsive design
- Admin panel for user management and payment oversight

## Tech Stack

- Frontend: React with TypeScript
- Backend: Express.js
- Database: In-memory storage (can be connected to PostgreSQL)
- Authentication: Firebase Authentication
- Styling: Tailwind CSS with shadcn/ui components

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.sample` to `.env`
   - Fill in your Firebase configuration values

4. Set up Firebase:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication
   - Add your domain to the authorized domains list in Firebase Authentication settings

5. Start the development server:

```bash
npm run dev
```

## Project Structure

```
.
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and libraries
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
├── server/               # Backend code
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage implementation
│   └── vite.ts           # Vite server configuration
└── shared/               # Shared code between frontend and backend
    └── schema.ts         # Database schema and types
```

## Default Admin Credentials

- Email: mike@gmail.com
- Password: isr828

## Key Features Documentation

### Task Creation
Users can create tasks by specifying:
- Task name
- Description
- Link for proof
- Number of users needed
- Price per user

### Task Completion
Users can:
- View available tasks
- Submit proof of completion
- Receive payment upon approval

### Wallet System
- Deposit funds (admin approval required)
- Withdraw earned money
- Track transaction history

### Referral System
- Each user gets a unique referral code
- 25 naira bonus for each referred user

### Admin Features
- User management (view, ban users)
- Approve/reject deposits and withdrawals
- View platform analytics
- Generate reports

## Additional Notes

- Users cannot complete their own tasks
- Users can only complete a task once
- Tasks are removed when all slots are filled
- The notification system uses the browser's built-in Notification API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.