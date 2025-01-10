import React from "react";
import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FilterToolbarProps } from "../events.type";

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchTerm,
  dateTime,
  onSearchTermChange,
  onDateTimeChange,
}) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: "center", alignItems: "center" }}
    >
      <FormControl variant="outlined" size="small" fullWidth>
        <Input
          id="search"
          name="searchTerm"
          placeholder="Search by event name"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          value={searchTerm}
          onChange={onSearchTermChange}
        />
      </FormControl>
      <FormControl size="small" sx={{ width: { md: "220px", xl: "260px" } }}>
        <InputLabel id="sort">Date and Time</InputLabel>
        <Select
          labelId="sort"
          name="dateTime"
          label="Sort by"
          value={dateTime}
          onChange={onDateTimeChange}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default FilterToolbar;
