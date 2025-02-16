import { Paper, MenuList } from "@mui/material";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import MenuItemComponent from "./menu-item";

const Navigation = () => {
  return (
    <Paper
      elevation={3}
      sx={{ p: 1, width: 200, maxWidth: "100%", height: "75vh" }}
    >
      <MenuList>
        <MenuItemComponent
          icon={RoofingOutlinedIcon}
          text="Home"
          href="/vendor/dashboard"
        />
        <MenuItemComponent
          icon={WorkOutlineOutlinedIcon}
          text="Gigs"
          href="/vendor/gigs"
        />
        <MenuItemComponent
          icon={AssignmentOutlinedIcon}
          text="Jobs"
          href="/vendor/jobs"
        />
      </MenuList>
    </Paper>
  );
};

export default Navigation;
