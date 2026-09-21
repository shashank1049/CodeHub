# CodeHub --- Developer Project Sharing Platform

> Discover projects, showcase your work, and connect with developers.

CodeHub is a developer-focused platform where users can share their
projects, explore work from the community, follow other developers, and
interact through likes, comments, and notifications.

## ✨ Features

-   **Authentication** --- Register, log in, and manage your account.
-   **Developer Profiles** --- View profiles, update profile details,
    and upload an avatar or cover image.
-   **Project Showcase** --- Create and explore projects with
    descriptions, tech stacks, GitHub repositories, and live demo links.
-   **Social Connections** --- Follow and unfollow developers, and view
    followers/following.
-   **Engagement** --- Like projects and interact through comments.
-   **Notifications** --- Stay updated on relevant activity.
-   **Search & Explore** --- Discover developers and projects.
-   **Responsive UI** --- Layouts designed for desktop and mobile
    screens.
-   **Theme Support** --- Light and dark theme styling.

## 🧰 Tech Stack

### Frontend

-   React
-   Vite
-   React Router
-   Tailwind CSS
-   Axios

### Backend / Services

The frontend communicates with the CodeHub backend through API service
modules. The backend uses Node.js, Express, and MongoDB. Image uploads
are handled through the backend's configured Cloudinary integration.

## 📁 Project Structure

``` text
frontend/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # Authentication and theme context
│   ├── pages/           # App pages (Explore, Profile, Projects, Auth, etc.)
│   ├── services/        # API communication
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

> Folder names may vary slightly depending on your current project
> structure.

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm
-   CodeHub backend running locally or a deployed backend URL

### 1. Clone the repository

``` bash
git clone https://github.com/shashank1049/CodeHub.git
cd CodeHub/frontend
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `frontend` directory and add the backend API
base URL expected by your Axios/service configuration.

Example (use the exact variable name already referenced in your frontend
code):

``` env
VITE_API_URL=http://localhost:5000/api
```

> If your project uses a different environment variable name or API
> prefix, use that exact value. Never commit secrets or private
> credentials.

### 4. Start the development server

``` bash
npm run dev
```

Vite will print the local development URL in your terminal (commonly
`http://localhost:5173`).

### 5. Build for production

``` bash
npm run build
```

To preview the production build locally:

``` bash
npm run preview
```

## 🔌 Backend Configuration

Make sure the CodeHub backend is running and accessible from the
frontend. Configure the frontend API base URL to match your backend
environment.

For production deployment: - Set the frontend environment variable to
your deployed backend API URL. - Configure the backend CORS allowlist to
include the deployed frontend domain. - Ensure authentication
cookies/tokens are configured appropriately for your deployment. - Keep
API keys, database credentials, and other secrets out of the frontend
repository.

## 🖼️ Screenshots

Add screenshots or GIFs of your application here:

``` text
docs/
└── screenshots/
    ├── explore.png
    ├── profile.png
    ├── project-details.png
    └── mobile-view.png
```

Then embed them, for example:

``` md
![CodeHub Explore](docs/screenshots/explore.png)
```

## 🗺️ Roadmap

-   [ ] Deploy the frontend and connect it to the production API
-   [ ] Add live application screenshots and demo link
-   [ ] Add automated frontend tests
-   [ ] Continue improving accessibility and responsive behavior

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/your-feature`
3.  Commit your changes.
4.  Push the branch and open a pull request.

## 👨‍💻 Author

**Shashank Mishra**

-   GitHub: [@shashank1049](https://github.com/shashank1049)

## 📄 License

Add a license file and update this section if you intend to distribute
CodeHub under a specific open-source license.
