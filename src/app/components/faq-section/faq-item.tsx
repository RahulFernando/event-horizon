import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { FAQProps } from "./faq-section.types";

const FAQItem: React.FC<FAQProps> = ({ summary, description }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      {summary}
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body1">{description}</Typography>
    </AccordionDetails>
  </Accordion>
);

export default FAQItem;
