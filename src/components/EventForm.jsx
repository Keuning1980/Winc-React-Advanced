import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Checkbox,
  CheckboxGroup,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";

export const EventForm = ({ onClose, onUpdateEvents }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
    createdBy: "",
  });

  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selectedCategories) => {
    const numericCategories = selectedCategories.map(Number);
    setFormData({ ...formData, categoryIds: numericCategories });
    if (numericCategories.length > 0) {
      setCategoryError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endTime <= formData.startTime) {
      setError("End time must be after start time");
      return;
    }

    if (formData.categoryIds.length === 0) {
      setCategoryError("At least one category must be selected");
      return;
    }

    if (!formData.createdBy) {
      setError("Created By must be selected");
      return;
    }

    try {
      // Ensure createdBy is a number
      const formDataToSubmit = {
        ...formData,
        createdBy: parseInt(formData.createdBy, 10),
      };

      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to submit event data");
      }

      const newEvent = await response.json();
      onUpdateEvents(newEvent);
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={5}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="image" isRequired>
            <FormLabel>Image URL</FormLabel>
            <Input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="location" isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="startTime" isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="endTime" isRequired isInvalid={error}>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <FormControl id="categoryIds" isInvalid={categoryError}>
            <FormLabel>Category</FormLabel>
            <CheckboxGroup
              onChange={handleCategoryChange}
              value={formData.categoryIds}
            >
              <Stack direction="column">
                <Checkbox value={1}>Sports</Checkbox>
                <Checkbox value={2}>Games</Checkbox>
                <Checkbox value={3}>Relaxation</Checkbox>
              </Stack>
            </CheckboxGroup>
            <FormErrorMessage>{categoryError}</FormErrorMessage>
          </FormControl>
          <FormControl id="createdBy" isRequired>
            <FormLabel>Created By</FormLabel>
            <Select
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="teal" size="md">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EventForm;
