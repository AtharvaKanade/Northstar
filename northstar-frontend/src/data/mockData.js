export const SAMPLE_ROADMAP = {
  career: "Backend Developer",
  summary: "A focused path to building server-side logic, APIs, and databases. This roadmap takes you from zero to a deployable API.",
  steps: [
    {
      id: 1,
      title: "Understand HTTP & DNS",
      description: "Before coding, learn how the internet works. What happens when you type google.com? Understand Status Codes (200, 404, 500).",
      type: "learn", // options: 'learn', 'build', 'fix'
      duration: "1 hour",
      isCompleted: true,
      resources: ["https://roadmap.sh/guides/dns-in-one-picture"]
    },
    {
      id: 2,
      title: "Node.js Basics",
      description: "Install Node environment. Learn to use the 'fs' module to read/write files and understand the Event Loop.",
      type: "learn",
      duration: "2 hours",
      isCompleted: false,
      resources: ["https://nodejs.org/en/docs/"]
    },
    {
      id: 3,
      title: "Build a Raw HTTP Server",
      description: "Create a server without Express. Handle a GET request and a POST request manually to understand streams.",
      type: "build",
      duration: "3 hours",
      isCompleted: false,
      resources: []
    },
    {
      id: 4,
      title: "Express.js Middleware",
      description: "Learn why we use frameworks. Implement a logger middleware that prints every request URL.",
      type: "learn",
      duration: "1.5 hours",
      isCompleted: false,
      resources: ["https://expressjs.com/en/guide/writing-middleware.html"]
    },
    {
      id: 5,
      title: "Database Integration (SQL)",
      description: "Connect your API to PostgreSQL. Create a 'Users' table and write a query to insert a new user.",
      type: "build",
      duration: "4 hours",
      isCompleted: false,
      resources: []
    }
  ]
};