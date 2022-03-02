import * as React from 'react';
import * as ReactDOM from 'react-dom';

import LinePlot from "./components/LinePlot"

const App: React.FunctionComponent = () => {
  return (
    <div>
      <LinePlot/>
    </div>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById("root")
);