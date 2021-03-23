import dangerIcon from './img/danger.svg';
import warningIcon from './img/warning.svg';
import infoIcon from './img/info.svg';
import checkIcon from './img/check.svg';

import './App.css';

function App() {
  const statuses = ["danger", "warning", "info", "check"];
  let status = "danger";

  return (
    <div className={"App " + status}>
      <div className="App-notification-container">
        {status === "danger" &&
          <img className="App-notification-icon" src={dangerIcon} alt="" srcset=""/>
        }
        {status === "warning" &&
          <img className="App-notification-icon" src={warningIcon} alt="" srcset=""/>
        }
        {status === "info" &&
          <img className="App-notification-icon" src={infoIcon} alt="" srcset=""/>
        }
        {status === "check" &&
          <img className="App-notification-icon" src={checkIcon} alt="" srcset=""/>
        }
        <div className="App-bulb App-bulb-s"></div>
        <div className="App-notification"></div>
        <div className="App-bulb App-bulb-l"></div>
      </div>
    </div>
  );
}

export default App;
