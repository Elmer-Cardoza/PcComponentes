
import './App.css';
import {Router} from "react-router-dom"; 
import Routes from "./Routes";
import {createBrowserHistory} from "history";
import {EstadoProveedor} from "./context/EstadoGeneral";
const BrowserHistory = createBrowserHistory();

function App() {
  return (
    <EstadoProveedor>
      <Router history = {BrowserHistory}>
        <Routes/>
      </Router>
    </EstadoProveedor>
  );
}

export default App;
