import { List, Datagrid, TextField, NumberField } from "react-admin";

const PriceList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="date" />
      <NumberField source="price" />
    </Datagrid>
  </List>
);

export default PriceList;
