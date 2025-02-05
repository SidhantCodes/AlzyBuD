"use client"
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const fetchAuthToken = async () => {
      const response = await fetch("http://localhost:8000/auth-token", {
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();
      console.log("Auth Token:", data.auth_token);
    };

    fetchAuthToken();
  }, []);

  return <h1>Check the console for the auth token</h1>;
};

export default App;
