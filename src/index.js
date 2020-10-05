import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, withRouter } from "react-router-dom";
import { createBrowserHistory } from 'history'
import { } from "@microsoft/applicationinsights-web";
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
});

ai.loadAppInsights();
ai.trackPageView();

const TelemetryProvider = withRouter(
  withAITracking(
    ai && ai.reactPlugin,
    class extends Component {
      render() {
        return this.props.children;
      }
    }
  )
);

const Foo = () => <h1>foo</h1>;
const Bar = () => <h1>bar</h1>;
const Baz = () => <h1>baz</h1>;


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter history={history}>
      <TelemetryProvider>
        <ul>
          <li><Link to="/">Foo</Link></li>
          <li><Link to="/bar">Bar</Link></li>
          <li><Link to="/baz">Baz</Link></li>
        </ul>

        <Route exact path="/" component={Foo} />
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


      </TelemetryProvider>
    </BrowserRouter >
  </React.StrictMode>,
  document.getElementById('root')
);


