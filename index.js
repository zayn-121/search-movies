import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import AppCopy from "./AppCopy";


const AppLayout = () => {
  return (
    <div>
      <App />
      {/* <AppCopy /> */}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayout />);
