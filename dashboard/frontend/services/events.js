import { List, Datagrid, TextField } from "react-admin";

const EventList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="date" />
      <TextField source="event" />
      <TextField source="type" />
    </Datagrid>
  </List>
);

export default EventList;
