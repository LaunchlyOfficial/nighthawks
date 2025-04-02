import { createRoot } from "react-dom/client";
import App from "./App"; // Your main App component
import "./index.css"; // Global styles (if you have any)

const root = createRoot(document.getElementById("root")!); // Create the root
root.render(<App />); // Render the App component inside the root div
