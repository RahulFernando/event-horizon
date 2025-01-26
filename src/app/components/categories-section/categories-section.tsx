"use client";
import React from "react";
import { Container, Grid2 as Grid } from "@mui/material";
import CategoryCard from "./category-card";
import { ICategories } from "@/app/types";
import useSWR from "swr";
import CategorySkeleton from "./category-skeleton";

// const categories = [
//   { title: "Caterin", src: "/images/categories/caterin.jpg" },
//   { title: "Venue", src: "/images/categories/venue.jpg" },
//   { title: "Entertainment", src: "/images/categories/entertainment.jpg" },
//   { title: "Decoration", src: "/images/categories/decoration.jpg" },
//   {
//     title: "Photography & Videography",
//     src: "/images/categories/photography.jpg",
//   },
//   {
//     title: "Rentals",
//     src: "/images/categories/rental.jpg",
//   },
// ];

async function fetchCategories(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as ICategories;
}

const CategoriesSection = () => {
  const { isLoading, data: categories = { count: 0, items: [] } } = useSWR(
    "/api/categories",
    fetchCategories
  );

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <Container maxWidth={false} sx={{ mb: 4 }}>
      <Grid container spacing={1}>
        {categories.items.map((category) => (
          <Grid
            key={category.id}
            size={{ xs: 12, md: 12 / categories.items.length }}
          >
            <CategoryCard {...category} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoriesSection;
