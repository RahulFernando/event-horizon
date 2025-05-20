import { styled } from "@mui/material";
import MuiMenuItem from "@mui/material/MenuItem";

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: "white",
    "& .MuiListItemIcon-root, & svg": {
      color: "white",
    },
  },
}));

export default MenuItem;
