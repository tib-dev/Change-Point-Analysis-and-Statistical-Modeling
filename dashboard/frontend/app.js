import * as React from "react";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

import PriceList from ".services/prices";
import EventList from ".services/events";
import ChangePointList from ".services/changepoints";
import Dashboard from ".services/dashboard";

const dataProvider = simpleRestProvider("http://localhost:5000");

const App = () => (
  <Admin dashboard={Dashboard} dataProvider={dataProvider}>
    <Resource name="prices" list={PriceList} />
    <Resource name="events" list={EventList} />
    <Resource name="changepoints" list={ChangePointList} />
  </Admin>
);

export default App;
