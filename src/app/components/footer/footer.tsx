import React from "react";
import { Container, Stack } from "@mui/material";
import FooterItem from "./footer-item";
import QuickLinks from "./quick-links";
import ContactUs from "./contact-us";
import Categories from "./categories";

const Footer = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: "background.paper",
        position: "static",
        bottom: 0,
        pt: 1,
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <FooterItem title="Caregories">
          <Categories />
        </FooterItem>
        <FooterItem title="Quick Links">
          <QuickLinks />
        </FooterItem>
        <FooterItem title="Contacts">
          <ContactUs />
        </FooterItem>
      </Stack>
    </Container>
  );
};

export default Footer;
