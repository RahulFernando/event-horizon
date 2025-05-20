import React from "react";
import LabelWithValue from "@/app/admin/events/components/label-with-value";
import {
  Grid2,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Address } from "@prisma/client";
import { NonEditablePersonalInfoProps } from "../profile.types";

const NonEditablePersonalInfo: React.FC<NonEditablePersonalInfoProps> = ({
  user,
}) => {
  const contacts = user ? (user.contacts ?? []).join(", ") : "N/A";

  const formatAddress = (address: Address) => {
    const parts = [
      address.number,
      address.line_1,
      address.line_2,
      address.state,
      address.postal_code,
      address.country,
    ];
    const filteredParts = parts.filter(
      (part) => part !== null && part !== undefined
    );
    return {
      location: filteredParts.join(", "),
      isDefault: address.is_default,
    };
  };

  const addresses = user ? user.addresses?.map(formatAddress) : [];

  return (
    <>
      <Grid2 container spacing={1}>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <LabelWithValue label="Name" value={user?.name ?? "----"} />
        </Grid2>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <LabelWithValue label="Contacts" value={contacts} />
        </Grid2>
      </Grid2>
      <Grid2 container spacing={1} mt={3}>
        <Grid2 size={{ xs: 6, md: 4 }}>
          <Typography variant="body2" color="textSecondary">
            Addresses
          </Typography>
          <List>
            {addresses?.map(({ location, isDefault }) => (
              <ListItem key={location} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: "26px" }}>
                  <FiberManualRecordIcon
                    fontSize="small"
                    color={isDefault ? "success" : "action"}
                  />
                </ListItemIcon>
                <ListItemText primary={location} />
              </ListItem>
            ))}
          </List>
        </Grid2>
      </Grid2>
    </>
  );
};

export default NonEditablePersonalInfo;
