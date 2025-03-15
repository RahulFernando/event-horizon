"use client";
import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/vendors?searchTerm=${searchTerm}`);
  };

  return (
    <form onSubmit={submitHandler}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: "200px", md: "400px", xl: "500px" },
          textAlign: "center",
          padding: "20px",
          mb: 4,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: "80%",
          }}
        />
        <Typography
          variant="h2"
          component="div"
          sx={{
            marginBottom: "16px",
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            zIndex: 1,
          }}
        >
          From planning to execution
          <br />
          we make your event seamless
        </Typography>

        <TextField
          placeholder="Search providers by category..."
          sx={{
            width: "300px",
            bgcolor: "white",
          }}
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
    </form>
  );
};

export default HeroSection;
