import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from 'history'
import { ApplicationInsights, SeverityLevel } from "@microsoft/applicationinsights-web";
import { ReactPlugin, withAITracking } from "@microsoft/applicationinsights-react-js";

const history = createBrowserHistory();

const reactPlugin = new ReactPlugin();
const ai = new ApplicationInsights({
  config: {
    instrumentationKey: "YOUR_APPINSIGHTS_INSTRUMENTATION_KEY",
    loggingLevelConsole: 2,
    maxBatchInterval: 0,
    maxBatchSizeInBytes: 1000,
    loggingLevelTelemetry: 2,
    autoTrackPageVisitTime: true,
    enableAutoRouteTracking: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: {
        history: history,
      },
    },
  },
})

ai.loadAppInsights();
ai.trackPageView();

const Foo = () => <h1>foo</h1>;
const Bar = () => <h1>bar</h1>;
const Baz = () => <h1>baz</h1>;

const App = withAITracking(reactPlugin, () => (
  <Router history={history}>
    <ul>
      <li><a href="/foo">Foo</a></li>
      <li><a href="/bar">Bar</a></li>
      <li><a href="/baz">Baz</a></li>
    </ul>

    <Route path="/foo" component={Foo} />
    <Route path="/bar" component={Bar} />
    <Route path="/baz" component={Baz} />

    <button onClick={() =>
      ai.trackException({
        error: new Error("some error"),
        severityLevel: SeverityLevel.Error,
      })}>
      Track Exception
          </button>

    <button onClick={() => ai.trackEvent({ name: "some event" })}>
      Track Event
          </button>

    <button onClick={() =>
      ai.trackTrace({
        message: "some trace",
        severityLevel: SeverityLevel.Information,
      })}>
      Track Trace
      </button>

    <button onClick={() => { return { field: { bar: "value" } }.wrong.missing }}>
      Auto collect an Error
      </button>

    <button onClick={() => fetch("https://httpbin.org/status/200")}>
      Auto collect a dependency (Fetch)
    </button>
  </Router >
))

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
