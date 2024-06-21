import React from "react";
import TopBar from "./components/TopBar";
import UserPage from "./pages/UserPage";
import SearchPage from "./pages/SearchPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import ProductPage from "./pages/ProductPage";
import './App.css';

const UserContext = React.createContext();
function App() {

  const [state, setState] = React.useState({
    currentPage: "SearchPage",
    username: null,
    currentPageState: 0
  })
  const user = [state,setState];
  console.log(state);
  let out = (<><SearchPage /></>);

  switch (state["currentPage"]) {
    case "SearchPage":
      out = <SearchPage />
      break;
    case "UserPage":
      out = <UserPage />
      break;
    case "ProductPage":
      out = <ProductPage />
      break;
    case "AuthenticationPage":
      out = <AuthenticationPage />
      break;
    default:
      out = (<><h1>404 Page not found</h1></>)
      // Error Page
      break;
  }

  return (
    <UserContext.Provider value={user}>
      {out}
    </UserContext.Provider>
  );
}

export default App;
export {UserContext};
