// src/App.jsx
import React from "react";
import AppRoutes from "./routes/AppRoutes"; // Imports the component

const App = () => {
    return (
        // AppRoutes now defines the Routes without its own Router
        <AppRoutes />
    );
};

export default App;