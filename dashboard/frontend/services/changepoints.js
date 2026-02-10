import { List, Datagrid, TextField, NumberField } from "react-admin";

const ChangePointList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="date" />
      <NumberField source="posterior_mean" />
    </Datagrid>
  </List>
);

export default ChangePointList;
