import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import statesJson from "../src/states.json";
const StateSelect = ({ stateSelection, handleChange }) => {
  return (
    <Autocomplete
      id="combo-box-demo"
      options={statesJson}
      value={stateSelection}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) =>
        option.abbreviation == value.abbreviation
      }
      style={{ width: 300 }}
      onChange={(e, v) => handleChange(v)}
      disableClearable={true}
      renderInput={(params) => (
        <TextField {...params} label="Pick a State" variant="outlined" />
      )}
    />
  );
};

export default StateSelect;
