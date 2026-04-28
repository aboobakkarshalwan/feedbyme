const { heading, para, bullet, pageBreak, emptyLine, makeTable } = require("./gen_report_part1");
const { HeadingLevel } = require("docx");

const ch2 = [
  heading("CHAPTER 2: TOOLS AND TECHNOLOGY USED"),

  heading("2.1 Programming Language", HeadingLevel.HEADING_2),
  para("We used JavaScript for every single part of this project. That might sound surprising if you are used to building things with, say, PHP for the backend and JavaScript only for frontend animations. But with the MERN stack, JavaScript is the only language you need. The frontend code that runs in the browser is JavaScript. The server code that handles requests is JavaScript. The database queries are written using a JavaScript library. Even the build tools and configuration files use JavaScript."),
  para("Why does this matter? Because it removes the mental overhead of switching between languages. When you are working on a feature, you might need to change the database model, update the API endpoint, and then modify the frontend component — all in one sitting. If each of those layers used a different language, you would be jumping between PHP and JavaScript and maybe SQL. With MERN, you stay in one language the whole time. Your brain does not have to context-switch. You think in one syntax, one set of conventions, one ecosystem."),
  para("We used modern JavaScript throughout — ES6 and beyond. That means arrow functions instead of the old function keyword, destructuring to pull values out of objects cleanly, template literals for building strings, async and await for handling asynchronous operations without callback hell, and the spread operator for merging objects and arrays. On the React side, we used JSX, which is a syntax extension that lets you write HTML-like code directly inside JavaScript. It looks weird at first, but once you get used to it, it makes building UI components much more intuitive than manually creating DOM elements."),
  para("JavaScript is not perfect — no language is. It has quirks like type coercion and hoisting that can trip you up if you are not careful. But for web development, it is the most practical choice available. It runs natively in every browser, it has the largest package ecosystem in the world (npm has over two million packages), and it has a massive community behind it. When we got stuck on something, there was always a Stack Overflow answer or a blog post that helped us figure it out."),

  heading("2.2 Web Framework", HeadingLevel.HEADING_2),
  para("The frontend of FeedByMe is built with React.js, version 18. React was created by Facebook (now Meta) and released in 2013. Since then, it has become the most popular library for building user interfaces on the web. Companies like Instagram, Netflix, Airbnb, and WhatsApp Web all use React."),
  para("The key idea behind React is components. Instead of building one big HTML page, you break your interface into small, independent pieces. Each piece is a component. A button is a component. A navigation bar is a component. A feedback card showing a title, rating, and author — that is a component. Each component manages its own data (called state) and renders itself based on that data. When the data changes, React automatically re-renders just the parts of the page that need to update. It does this using something called the virtual DOM, which is basically a lightweight copy of the real DOM. React compares the virtual DOM with the real one, figures out the minimum number of changes needed, and applies only those changes. This makes updates fast even when the page is complex."),
  para("We have eleven reusable components in FeedByMe: Navbar, Sidebar, FeedbackCard, FilterBar, StarRating, ConfirmModal, EmptyState, Loader, NotificationPanel, Pagination, and TagInput. Each one is written once and used in multiple places. For example, the StarRating component is used on the feedback submission form, on the feedback detail page, and on the feedback cards. If we ever want to change how stars look, we change one file and it updates everywhere."),
  para("For global state management, we used React's Context API. This lets us create shared data that any component can access without passing it through every level of the component tree. We have four contexts — AuthContext holds the logged-in user's data and login/logout functions, ProjectContext holds the list of boards, FeedbackContext holds feedback entries, and NotificationContext holds notification data. Any component that needs this data can simply call useAuth(), useProjects(), etc."),
  para("On the backend, we used Express.js, version 4.21. Express is a minimal web framework for Node.js. It does not tell you how to organize your code or force you to use specific patterns. It just gives you tools to define routes, apply middleware, and send responses. A route is a combination of an HTTP method and a URL path — for example, POST /api/auth/register. Middleware is a function that runs before the route handler — for example, our auth middleware checks the JWT token before letting the request through to the controller."),
  para("We organized the backend using a controller pattern. Each domain has three files: a model (defines the data structure), a controller (contains the business logic), and a route file (maps URLs to controller functions). So for authentication, we have User.js (model), authController.js (controller), and auth.js (routes). For feedback, we have Feedback.js, feedbackController.js, and feedback.js. This keeps things organized and makes it easy to find the code responsible for any given feature."),
  para("For client-side routing, we used React Router DOM version 6. This lets us define different pages for different URLs without actually loading a new page from the server. When you go from /dashboard to /board/123, React Router swaps out the Dashboard component for the ProjectBoard component — all within the same page load. This makes navigation feel instant. We defined four route wrappers: ProtectedRoute requires login, PublicLayout works for everyone, AdminRoute requires admin role, and GuestRoute redirects logged-in users away from the login page."),

  heading("2.3 Cloud Technologies", HeadingLevel.HEADING_2),
  para("We relied on two cloud services for this project, and both of them are free for the level of usage we need."),
  para("The first is MongoDB Atlas, which hosts our database. The second is Vercel, which hosts our deployed application. Using cloud services instead of running everything locally has several practical benefits. First, anyone can access the app from anywhere — they do not need to be on our local network. Second, the data is backed up automatically. Third, we do not need to worry about server maintenance, software updates, or hardware failures. The cloud providers handle all of that."),

  heading("2.3.1 MongoDB Atlas", HeadingLevel.HEADING_3),
  para("MongoDB Atlas is a cloud database service run by the company that makes MongoDB. It lets you host your MongoDB database on Amazon Web Services, Google Cloud, or Microsoft Azure without managing any servers yourself. You just create an account, create a cluster (which is basically a group of servers that store your data), create a database user, and copy a connection string into your application."),
  para("We used the free tier, which is called M0. It gives you 512 megabytes of storage on a shared cluster. For a project like FeedByMe, this is more than enough. Even if you stored thousands of feedback entries with comments and custom answers, you would still have plenty of room."),
  para("One thing we had to be careful about is the IP whitelist. By default, Atlas blocks all connections unless the connecting IP address is on the whitelist. During development, we added our own IP address. But IP addresses can change, especially on home internet connections. This caused connection timeouts a few times. The quick fix is to allow access from all IPs by adding 0.0.0.0/0 to the whitelist. This is not recommended for production apps with sensitive data, but for a student project, it saves a lot of headaches."),
  para("Atlas also gives you a web-based data explorer. You can open it in your browser and see all your collections, click into individual documents, run queries, and even edit data directly. We used this constantly during development to check if our API was storing data correctly. For example, after implementing the custom questions feature, we would create a board with custom fields, submit feedback with answers, and then check Atlas to make sure the customAnswers array was saved properly."),

  heading("2.4 Development Tools and Libraries", HeadingLevel.HEADING_2),
  para("Beyond the core framework, we used a bunch of libraries that made specific tasks easier. Here is each one and why we used it:"),
  bullet("Vite — This is our build tool and development server for the frontend. Vite is crazy fast. When you save a file during development, the change appears in the browser almost instantly. It uses something called Hot Module Replacement, which means it swaps out the changed module without reloading the entire page. For production, Vite creates optimized bundles with code splitting, so the browser only downloads the code it needs for the current page. We chose Vite over Create React App because CRA has become slow and bloated, and the React team themselves now recommend alternatives."),
  bullet("Mongoose (v8.6.0) — This is the library we use to interact with MongoDB from our Node.js code. Mongoose lets you define schemas for your data, which is kind of ironic because MongoDB is supposed to be schema-less. But in practice, having schemas is helpful because it catches mistakes early. If you try to save a feedback entry without a title, Mongoose will throw a validation error instead of silently saving incomplete data. Mongoose also gives you methods for querying, updating, and deleting documents that are easier to use than raw MongoDB commands."),
  bullet("bcryptjs (v2.4.3) — This handles password hashing. You should never, ever store passwords as plain text. If someone gets access to your database, they should not be able to read anyone's password. bcrypt takes a plain-text password and runs it through a one-way hashing algorithm with a random salt. The result is a string of characters that cannot be reversed back to the original password. When a user logs in, bcrypt hashes the submitted password the same way and compares the two hashes. We use 12 salt rounds, which means the hashing process is intentionally slow enough to make brute-force attacks impractical."),
  bullet("jsonwebtoken (v9.0.2) — This is how we handle authentication without sessions. When a user logs in, the server creates a JSON Web Token containing the user's ID, signs it with a secret key, and sends it back. The frontend stores this token and sends it with every subsequent request. The server can verify the token's signature to confirm it has not been tampered with and extract the user ID from it. JWTs are stateless — the server does not need to store any session data. This makes the app easier to scale because any server instance can verify any token."),
  bullet("Multer (v1.4.5) — This handles file uploads. When someone submits feedback with a screenshot, the image file is sent as multipart form data. Multer processes this data, saves the file to the server's filesystem, and makes the file information available to our controller. We configured it to accept only image files and reject anything larger than 5 MB."),
  bullet("Helmet (v7.1.0) — This sets security-related HTTP headers automatically. Things like preventing clickjacking, blocking MIME type sniffing, and setting a strict content security policy. You just add one line of code and it takes care of a bunch of security best practices that you might forget to implement manually."),
  bullet("express-rate-limit (v7.4.0) — This prevents abuse by limiting how many requests a single IP address can make. We set it to 200 requests per 15 minutes in production. This stops someone from writing a script that floods our server with thousands of requests. In development mode, the limit is 5000 because the Vite proxy generates extra requests."),
  bullet("express-validator (v7.2.0) — This validates user input on the server side. Even though we also validate on the frontend, you should always validate on the server too because someone could bypass the frontend and send requests directly to the API. This library checks things like email format, string length, and enum values before the request reaches the controller."),
  bullet("Axios — This is the HTTP client we use on the frontend. It makes API calls to our backend. We set up an interceptor that automatically attaches the JWT token to every request, so we do not have to manually add the Authorization header every time."),
  bullet("Recharts — This is a React charting library. We used it to build the pie chart and bar chart on the admin dashboard. It is simple, well-documented, and integrates naturally with React because the charts are just React components."),
  bullet("React Hot Toast — This shows little notification messages in the corner of the screen. When you successfully submit feedback, you see a green checkmark and the text Success. When something fails, you see a red error message. It is a small touch, but it makes the app feel more responsive and user-friendly."),

  heading("2.5 Summary", HeadingLevel.HEADING_2),
  para("Every technology and library we used was chosen for a specific reason. JavaScript as the single language keeps things simple. React makes the frontend fast and organized. Express keeps the backend lightweight and flexible. MongoDB gives us a flexible database that can handle nested, evolving data structures. And all the supporting libraries — from bcrypt for security to Recharts for visualization — solve specific problems that we did not want to reinvent from scratch. The entire stack is open source and free, which means anyone can take our code, run it on their machine, and have a working application without spending a single rupee."),
  pageBreak(),
];

const ch3 = [
  heading("CHAPTER 3: DATA COLLECTION AND ANALYSIS"),

  heading("3.1 Data Collection Mechanisms", HeadingLevel.HEADING_2),
  para("FeedByMe is, at its core, a data collection tool. Everything in the application revolves around collecting information from users, storing it reliably, and presenting it in a way that helps board owners make decisions. There are three main ways data enters the system."),
  para("The first way is through the registration form. When someone creates an account, they type in their name, email, and password. The frontend validates that the name is at least two characters long, the email looks like a real email, and the password is at least six characters. If everything checks out, this data is sent to the server. The server does its own validation (because you should never trust the client), hashes the password with bcrypt, creates a new document in the Users collection, and sends back a JWT token. From this single form submission, we get a user account that persists in the database."),
  para("The second way is through the feedback submission form. This is the most important data collection point. When someone fills out the feedback form, the system collects their star rating (a number from one to five), a title (a short summary of their feedback), a detailed description, a category selection, a priority level, optional tags, an optional image file, and answers to any custom questions the board owner has set up. If the person is logged in, their user ID is automatically linked to the feedback. If they are a guest, their email address is collected instead. All of this is packaged into a single API request and stored as one document in the Feedbacks collection."),
  para("The third way is through the project creation form on the dashboard. When a user creates a new board, they provide a name, description, theme color, logo URL, and custom question definitions. This data goes into the Projects collection. The custom fields are stored as an array of objects, each with a label, field type, and required flag. This data determines what the feedback form will look like for that specific board."),

  heading("3.2 Data Preprocessing and Validation", HeadingLevel.HEADING_2),
  para("We do not just take whatever the user types and throw it into the database. That would be asking for trouble. Instead, every piece of data goes through multiple rounds of cleaning and validation before it is stored."),
  para("On the frontend, we use basic form validation to catch obvious mistakes. If someone tries to submit feedback without a title, the form shows an error message and refuses to submit. If the email field is empty for a guest user, same thing. If no stars are selected, the form will not let you proceed. This gives users immediate feedback about what they need to fix."),
  para("On the backend, we use express-validator to run a more thorough set of checks. The registration endpoint checks that the name is between 2 and 50 characters, the email matches a standard regex pattern for emails, and the password is at least 6 characters. The feedback endpoint checks that the title is between 3 and 200 characters, the description is between 10 and 5000 characters, and the category is one of the five allowed values. If any check fails, the server sends back a 400 error with a clear message explaining what went wrong."),
  para("At the database level, Mongoose schemas enforce type constraints. The rating field has min: 1 and max: 5. The status field can only be one of five specific strings. The email field uses a regex validator. If somehow bad data gets past both the frontend and the express-validator checks (which should not happen, but you never know), Mongoose will catch it and refuse to save the document. This three-layer approach — frontend, middleware, database — means that invalid data essentially cannot make it into the system."),
  para("For image uploads, Multer does its own preprocessing. It checks the file's MIME type to make sure it is actually an image and not some other file renamed with a .jpg extension. It enforces a 5 MB size limit. And it renames the file using a timestamp to avoid naming conflicts if two people upload files with the same name at the same time."),

  heading("3.3 Feature Engineering and Aggregation", HeadingLevel.HEADING_2),
  para("Besides storing raw data, FeedByMe also calculates derived values that make the data more useful. These are things you could figure out manually by looking at the raw data, but we compute them automatically so the user does not have to."),
  para("The Feedback model has two virtual properties. The first is upvoteCount, which simply counts how many user IDs are in the upvotes array. Instead of storing a separate number that we would have to remember to update every time someone upvotes or removes their upvote, we just compute it from the array length. The second virtual is commentCount, which counts the comments array the same way. Virtuals are not stored in the database — they are calculated on the fly when you read a document."),
  para("The admin dashboard takes aggregation further. When an admin opens the analytics page, the server queries the entire Feedbacks collection and groups the results by status and by category. It counts how many feedback entries are Open, how many are In Progress, how many are Under Review, how many are Resolved, and how many are Closed. It does the same grouping by category. It also calculates the overall average star rating across all feedback. These numbers are sent to the frontend, where Recharts turns them into a pie chart and a bar chart. This gives the admin a quick visual overview of the entire system without having to manually count anything."),
  para("On the feedback listing page, the backend supports dynamic filtering and sorting. You can filter by project, status, category, priority, or author. You can sort by creation date, rating, or upvote count. The server builds a MongoDB query object based on whatever filters the user has applied, runs the query with sort and pagination, and returns the matching results along with the total count. This means the frontend can show things like Showing 11-20 of 47 results with Previous and Next buttons."),

  heading("3.4 Exploratory Data Analysis", HeadingLevel.HEADING_2),
  para("The admin dashboard is where all the collected data comes together into something visual and meaningful. It has four main sections."),
  para("The first section is the summary cards at the top. These show three numbers: total registered users, total feedback submissions across all boards, and the average star rating. These numbers update every time the page loads, so the admin always sees the current state. If the average rating is high, things are going well. If it is dropping, something needs attention."),
  para("The second section is the status pie chart. It shows the proportion of feedback in each status — Open, In Progress, Under Review, Resolved, and Closed. Each status gets a different color. If you see that most of the pie is Open, it means feedback is piling up without being addressed. If most of it is Resolved, the team is keeping up. This kind of visual breakdown is much easier to understand than a table of numbers."),
  para("The third section is the category bar chart. It shows how many feedback entries fall into each category — Bug, Feature Request, Improvement, General, and Other. If bugs dominate, there might be quality issues. If feature requests dominate, users are generally happy but want more. This helps the board owner understand what kind of feedback they are getting most."),
  para("The fourth section is the user management table, which lists all registered users with their name, email, role, and when they signed up. Admins can use this to keep track of who is using the system."),

  heading("3.5 Data Flow in the System", HeadingLevel.HEADING_2),
  para("Let me walk you through exactly what happens when someone submits feedback. This will make the data flow concrete."),
  para("It starts in the browser. The user fills out the feedback form on the FeedbackNew page. They click the stars to set a rating, type a title and description, select a category from the dropdown, maybe attach a screenshot, and answer any custom questions. They hit the Submit button."),
  para("React's form handler fires. It gathers all the form data into a FormData object (because we need to support file uploads, which require multipart encoding instead of regular JSON). If the user is logged in, the Axios interceptor automatically adds their JWT token to the request header. The request goes to POST /api/feedback."),
  para("On the server side, the request hits the middleware stack. First, CORS checks the origin. Then, the rate limiter checks if this IP has made too many requests. Then, the body parser reads the request body. Then, Multer checks if there is a file attached and processes it. Then, the auth middleware (in optional mode) checks for a JWT token — if one is present, it decodes it and attaches the user to the request; if not, it lets the request through as a guest."),
  para("The request reaches the createFeedback controller function. The controller reads the title, description, category, priority, rating, and custom answers from the request body. If Multer saved a file, the controller reads the file path. If the user is authenticated, the controller sets the author field to the user's ID. If not, it uses the guest email. It creates a new Feedback document using the Mongoose model and saves it to MongoDB."),
  para("MongoDB stores the document in the feedbacks collection. It assigns it an auto-generated ObjectId, sets the createdAt and updatedAt timestamps, and indexes it by project, status, category, and text fields."),
  para("The controller sends back a 201 response with the created feedback document as JSON. The frontend receives this response, shows a success toast notification, and navigates the user back to the board page. The new feedback entry appears in the list because the board page refetches the feedback data when it loads. The whole round trip takes about 100 to 200 milliseconds."),

  heading("3.6 Summary", HeadingLevel.HEADING_2),
  para("Data flows through FeedByMe in a clean, predictable way. Users enter data through forms on the frontend. The frontend validates it before sending. The backend validates it again with express-validator. Mongoose validates it a third time against the schema. Only then does it get stored in MongoDB. Computed values like upvote counts and category distributions are derived automatically, so the data that users see is always accurate and up-to-date. And the admin dashboard turns raw numbers into visual charts that make patterns easy to spot. The whole system is designed so that data integrity is maintained at every step, from input to storage to display."),
  pageBreak(),
];

const ch4 = [
  heading("CHAPTER 4: SYSTEM REQUIREMENTS AND ANALYSIS"),

  heading("4.1 System Requirements Specification", HeadingLevel.HEADING_2),
  para("Before you write a single line of code, you need to know what you are building. That is what system requirements are for. They are basically a contract between you and yourself (or your client) that says: this is exactly what the software will do, and this is how well it will do it. We split our requirements into two categories — functional and non-functional."),

  heading("4.1.1 Functional Requirements", HeadingLevel.HEADING_3),
  para("Functional requirements describe specific things the system must be able to do. Each one is a feature or behavior that a user can interact with. Here is the complete list for FeedByMe:"),
  makeTable(["ID", "Requirement", "What it means"], [
    ["FR-01", "User Registration", "A new user can create an account by providing their name, email, and a password of at least six characters"],
    ["FR-02", "User Login", "A registered user can log in with their email and password and receive a security token"],
    ["FR-03", "Password Reset", "A user who forgot their password can request a reset token and set a new password"],
    ["FR-04", "Profile Update", "A logged-in user can change their name, email, or avatar from the profile page"],
    ["FR-05", "Create Board", "A logged-in user can create a new feedback board with a name and optional settings"],
    ["FR-06", "Custom Questions", "A board owner can add custom questions to their board's feedback form"],
    ["FR-07", "Board Branding", "A board owner can set a theme color and upload a logo for their board"],
    ["FR-08", "Share Link", "Every board gets a unique URL that anyone can access to view and submit feedback"],
    ["FR-09", "Submit Feedback", "Anyone with the board link can submit feedback with a rating, title, and description"],
    ["FR-10", "Guest Access", "People who are not registered can submit feedback by entering just their email"],
    ["FR-11", "Image Upload", "Users can attach an image file (screenshot) when submitting feedback"],
    ["FR-12", "View Feedback", "All feedback entries for a board are visible on the board's page"],
    ["FR-13", "Filter and Sort", "Feedback can be filtered by status, category, and priority, and sorted by date or rating"],
    ["FR-14", "Upvote", "Logged-in users can upvote a feedback entry to show they agree with it"],
    ["FR-15", "Comments", "Logged-in users can add comments to discuss a feedback entry"],
    ["FR-16", "Status Update", "Board owners can change the status of feedback (Open, In Progress, Resolved, etc.)"],
    ["FR-17", "Delete Feedback", "Authors, board owners, and admins can delete feedback entries"],
    ["FR-18", "Admin Analytics", "Admins can see charts showing feedback distribution by status and category"],
    ["FR-19", "User Management", "Admins can view all registered users and their details"],
    ["FR-20", "Notifications", "Users receive notifications when relevant events happen on their boards"],
  ]),
  emptyLine(),

  heading("4.1.2 Non-Functional Requirements", HeadingLevel.HEADING_3),
  para("Non-functional requirements are about quality. They do not describe what the system does, but how well it does it — how fast, how secure, how easy to use, and how reliable."),
  makeTable(["ID", "Area", "Requirement"], [
    ["NFR-01", "Speed", "API responses should finish within 500 milliseconds for normal operations"],
    ["NFR-02", "Speed", "Pages should load within 3 seconds on a normal internet connection"],
    ["NFR-03", "Security", "Passwords must be hashed with bcrypt before they touch the database"],
    ["NFR-04", "Security", "Every protected API endpoint must check for a valid JWT token"],
    ["NFR-05", "Security", "Rate limiting must cap requests at 200 per 15 minutes per IP"],
    ["NFR-06", "Security", "HTTP security headers must be set using Helmet"],
    ["NFR-07", "Usability", "The interface must work on screens as small as 320 pixels wide"],
    ["NFR-08", "Usability", "Touch targets must be at least 44 pixels to prevent mis-taps on mobile"],
    ["NFR-09", "Reliability", "The database must be cloud-hosted with automatic backups"],
    ["NFR-10", "Maintainability", "Code must be organized into separate modules with clear responsibilities"],
  ]),
  emptyLine(),

  heading("4.2 Hardware and Software Requirements", HeadingLevel.HEADING_2),
  para("You do not need a fancy computer to run FeedByMe. We developed it on a regular laptop and it ran perfectly fine. Here is what you need:"),
  makeTable(["What", "Minimum", "Why"], [
    ["Processor", "Intel i3 or similar", "Node.js and Vite need a reasonable CPU for builds"],
    ["RAM", "4 GB (8 GB better)", "Running the server, the client dev server, and a browser together uses memory"],
    ["Storage", "500 MB free", "For project files, node_modules, and uploaded images"],
    ["Internet", "Any broadband", "Needed for MongoDB Atlas and downloading npm packages"],
    ["OS", "Windows 10+, macOS, or Linux", "Node.js runs on all three"],
    ["Node.js", "Version 18 or higher", "Our code uses features from Node 18"],
    ["npm", "Version 9 or higher", "Comes with Node.js, manages our packages"],
    ["Browser", "Chrome, Edge, or Firefox", "For testing the frontend"],
    ["Code Editor", "VS Code (recommended)", "For writing and debugging code"],
    ["Git", "Latest version", "For version control and pushing to GitHub"],
    ["MongoDB Atlas", "Free M0 account", "For hosting the database in the cloud"],
  ]),
  emptyLine(),
  para("For deployment, we use Vercel's free tier. Vercel handles the hosting, CDN, and serverless function execution. There is no additional hardware or server rental needed. The total cost of running FeedByMe in production is literally zero rupees."),

  heading("4.3 System Overview", HeadingLevel.HEADING_2),
  para("FeedByMe uses a three-tier architecture. Think of it like a restaurant. The frontend (React) is the dining area where customers sit. The backend (Express/Node) is the kitchen where food is prepared. The database (MongoDB) is the storeroom where ingredients are kept. Customers never go into the kitchen, and they definitely never go into the storeroom. They interact with the waiter (the API), who takes their order to the kitchen, and the kitchen gets what it needs from the storeroom."),
  para("In technical terms: the React single-page application runs in the user's browser. Every action the user takes — submitting feedback, creating a board, logging in — triggers an HTTP request from the browser to the Express server. The server processes the request, talks to MongoDB if it needs to read or write data, and sends back a JSON response. The React app then updates the interface based on that response."),
  para("This separation has a big advantage: the frontend and backend are completely independent. You could replace the React frontend with a mobile app and the backend would not need to change at all. You could switch from MongoDB to PostgreSQL and the frontend would not notice. Each tier only talks to the one next to it, through a well-defined interface (the REST API)."),
  para("Authentication works through JWT tokens. When you log in, the server gives you a token. Your browser stores it. Every time you make a request, Axios automatically includes the token in the request header. The server checks the token before processing protected requests. If the token is missing or invalid, the server returns a 401 error. This is called stateless authentication because the server does not need to remember who is logged in — the token carries all the information."),
  para("For routes that should work for both logged-in users and guests (like the feedback submission endpoint), we have an optionalAuth middleware. It tries to verify the token, but if there is no token, it just lets the request through without a user object. The controller then checks whether req.user exists to decide if this is an authenticated or guest submission."),

  heading("4.4 Summary", HeadingLevel.HEADING_2),
  para("This chapter laid out everything we need before writing code. We defined twenty functional requirements that describe every feature of the application. We defined ten non-functional requirements that set the quality bar for performance, security, usability, and maintainability. We listed the hardware and software needed to develop and run the project. And we described the three-tier system architecture with its REST API, stateless authentication, and clear separation of concerns. With these requirements in hand, we moved into the implementation phase described in the next chapter."),
  pageBreak(),
];

module.exports = { ch2, ch3, ch4 };
