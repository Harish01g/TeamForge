# TeamForge

TeamForge helps college students find teammates for projects, hackathons, clubs, and other activities.

This is a **partly full-stack app**. Student accounts, profile edits, the student directory, opportunities, saved opportunities, join requests, team chat, team workspaces, and in-app notifications use MongoDB through an Express API.

## What you need

- Node.js 18 or newer
- A MongoDB database. You can run MongoDB on your computer or create a free MongoDB Atlas database.

## Start the backend

Open a terminal in the `backend` folder and run:

```bash
npm install
```

Copy `.env.example` to a new file named `.env`. Put your Atlas connection string in `MONGODB_URI`. Generate a signing secret by running `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in the backend terminal, then put the printed value after `JWT_SECRET=`. Keep `.env` private; it is ignored by Git. Never share or commit it.

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:4000`. You can check `http://localhost:4000/api/health` to see whether it is running.

## Start the frontend

Open a second terminal in the `frontend` folder and run:

```bash
npm install
npm run dev
```

Open the local URL Vite prints, usually `http://localhost:5173`. Keep both terminals running while you use the app. The frontend forwards `/api` requests to the backend.

## Current backend features

- `POST /api/auth/register` creates a student account.
- `POST /api/auth/login` signs a student in.
- `GET /api/auth/me` returns the signed-in student's profile.
- `PATCH /api/auth/me` saves profile edits.
- `GET /api/students` searches signed-in students by name, major, bio, skill, or interest. Optional query parameters are `q`, `year`, and `page`.
- `GET /api/students/:id` returns one student's directory profile. Email addresses are not included.
- `GET /api/join-requests` returns requests sent by the signed-in student and requests for opportunities they own.
- `POST /api/join-requests` creates a request to join an opportunity.
- `PATCH /api/join-requests/:id` lets an applicant withdraw or an opportunity owner accept or decline a pending request.
- `GET /api/messages` lists team chats the signed-in student can access.
- `POST /api/messages/:opportunityId` saves a message to an opportunity's team chat.
- `PATCH /api/messages/:opportunityId/read` marks messages in that chat as read.
- `GET /api/notifications` lists the signed-in student's latest notifications.
- `PATCH /api/notifications/:id/read` marks one notification as read.
- `PATCH /api/notifications/read-all` marks all of the signed-in student's notifications as read.
- `GET /api/saved` lists the signed-in student's saved opportunity IDs.
- `POST /api/saved/:opportunityId` saves an opportunity for the signed-in student.
- `DELETE /api/saved/:opportunityId` removes one saved opportunity.
- `DELETE /api/saved` clears the signed-in student's saved opportunities.
- `GET /api/teams` lists the signed-in student's team workspaces.
- `POST /api/teams/:teamId/milestones` adds a milestone to a team workspace.
- `PATCH /api/teams/:teamId/milestones/:milestoneId` updates milestone completion.
- `DELETE /api/teams/:teamId/membership` lets a non-lead team member leave.
- `POST /api/opportunities` creates a post as the signed-in student.
- `PATCH /api/opportunities/:id` lets only the post creator edit opportunity details. The server preserves team membership and recalculates open spots when team size changes.
- `GET /api/opportunities` and `GET /api/opportunities/:id` read posts.
- `DELETE /api/opportunities/:id` lets the post creator remove their post.

The frontend calls the API through the service files in `frontend/src/services/`. Passwords are hashed before they are stored; sign-in sessions use a token. Directory, join-request, team-chat, team-workspace, notification, and saved-opportunity access require sign-in. Other students can see a student's name, year, major, bio, skills, interests, availability, portfolio links, and completed projects, but not their email address. Opportunity owners can review an applicant's profile before accepting or declining. Accepting adds that student to the opportunity's team and reduces its open spots. Only current opportunity team members can read or send chat messages and manage workspace milestones. Messages, notifications, saved opportunities, and milestones are stored in MongoDB. Team chat refreshes automatically while its page is open; notification counts refresh periodically. Notifications are created for join requests, decisions, and team messages. New profiles, opportunities, join requests, messages, notifications, saved opportunities, and team milestones remain in MongoDB after refreshing the page. Existing sample opportunity cards are not automatically copied into the database; create an account and post an opportunity to see data appear.

## Folder guide

- `frontend/src/pages/` contains the app screens.
- `frontend/src/components/` contains reusable interface pieces.
- `frontend/src/services/` connects screens to data.
- `frontend/src/data/` contains sample data for features not yet connected to the server.
- `backend/src/models/` describes MongoDB records.
- `backend/src/routes/` contains the API endpoints.

## Next steps

Finalise end-to-end checks with multiple student accounts.
