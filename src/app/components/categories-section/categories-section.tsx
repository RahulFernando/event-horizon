import React from "react";
import { Container, Grid2 as Grid } from "@mui/material";
import CategoryCard from "./category-card";

const categories = [
  { title: "Caterin", src: "/images/categories/caterin.jpg" },
  { title: "Venue", src: "/images/categories/venue.jpg" },
  { title: "Entertainment", src: "/images/categories/entertainment.jpg" },
  { title: "Decoration", src: "/images/categories/decoration.jpg" },
  {
    title: "Photography & Videography",
    src: "/images/categories/photography.jpg",
  },
  {
    title: "Rentals",
    src: "/images/categories/rental.jpg",
  },
];

const CategoriesSection = () => {
  return (
    <Container maxWidth={false} sx={{ mb: 4 }}>
      <Grid container spacing={1}>
        {categories.map((category) => (
          <Grid
            key={category.src}
            size={{ xs: 12, md: 12 / categories.length }}
          >
            <CategoryCard {...category} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoriesSection;
