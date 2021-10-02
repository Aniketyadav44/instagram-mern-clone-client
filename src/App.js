import React, { useEffect, useContext, useReducer, createContext } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Screens/Home";
import Signin from "./Components/Screens/Signin";
import Signup from "./Components/Screens/Signup";
import Profile from "./Components/Screens/Profile";
import CreatePost from "./Components/Screens/CreatePost";
import SinglePost from "./Components/Screens/SinglePost";
import EditPost from "./Components/Screens/EditPost";
import EditUser from "./Components/Screens/EditUser";
import { initialState, reducer } from "./Reducers/userReducer";
import ResetPassword from "./Components/Screens/ResetPassword";
import NewPassword from "./Components/Screens/NewPassword";

export const UserContext = createContext();

const Routing = () => {
  const { dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/reset")) {
        history.push("/signin");
      }
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/profile/:userId">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/post/:postId">
        <SinglePost />
      </Route>
      <Route path="/edit/:postId">
        <EditPost />
      </Route>
      <Route path="/edituser">
        <EditUser />
      </Route>
      <Route exact path="/reset">
        <ResetPassword/>
      </Route>
      <Route path="/reset/:token">
        <NewPassword/>
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state: state, dispatch: dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
