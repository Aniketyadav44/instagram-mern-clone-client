import './App.css';
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Navbar from './Components/Navbar';
import Home from './Components/Screens/Home';
import Signin from './Components/Screens/Signin';
import Signup from './Components/Screens/Signup';

const Routing = ()=>{
  return <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
    <Route path="/signin">
      <Signin/>
    </Route>
    <Route path="/signup">
      <Signup/>
    </Route>
  </Switch>
}

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routing/>
    </BrowserRouter>
  );
}

export default App;
