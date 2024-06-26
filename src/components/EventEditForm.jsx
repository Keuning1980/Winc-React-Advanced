import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Select,
  Checkbox,
  CheckboxGroup,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

export const EventEditForm = ({ event, onClose, onUpdateEvents }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
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
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Event not found");
        }
        const eventData = await response.json();
        setFormData({
          title: eventData.title,
          description: eventData.description,
          image: eventData.image,
          location: eventData.location,
          startTime: formatDateTimeLocal(eventData.startTime),
          endTime: formatDateTimeLocal(eventData.endTime),
          categoryIds: eventData.categoryIds,
          createdBy: eventData.createdBy,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selectedCategories) => {
    const numericCategories = selectedCategories.map(Number);
    setFormData({ ...formData, categoryIds: numericCategories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endTime <= formData.startTime) {
      setError("End time must be after start time");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          createdBy: parseInt(formData.createdBy),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event data");
      }

      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (onClose) onClose();
      if (onUpdateEvents) onUpdateEvents();
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "There was an error updating the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'
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
          <FormControl id="categoryIds">
            <FormLabel>Category</FormLabel>
            <CheckboxGroup
              onChange={handleCategoryChange}
              value={formData.categoryIds.map(String)}
            >
              <Stack direction="column">
                <Checkbox value="1">Sports</Checkbox>
                <Checkbox value="2">Games</Checkbox>
                <Checkbox value="3">Relaxation</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
          <FormControl id="createdBy" isRequired>
            <FormLabel>Created By</FormLabel>
            <Select
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="teal" size="md">
            Update
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EventEditForm;
