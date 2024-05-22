import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Box,
  Text,
  Image,
  Button,
  Center,
  VStack,
  Heading,
  Divider,
  HStack,
  useToast,
} from "@chakra-ui/react";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";
import { EventEditModal } from "../components/EventEditModal";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for controlling the modal
  const toast = useToast();

  const fetchEventData = async () => {
    try {
      const [eventResponse, categoriesResponse, usersResponse] =
        await Promise.all([
          fetch(`http://localhost:3000/events/${eventId}`),
          fetch("http://localhost:3000/categories"),
          fetch("http://localhost:3000/users"),
        ]);

      if (!eventResponse.ok) {
        throw new Error("Event not found");
      }
      if (!categoriesResponse.ok) {
        throw new Error("Failed to fetch categories");
      }
      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const eventData = await eventResponse.json();
      const categoriesData = await categoriesResponse.json();
      const usersData = await usersResponse.json();

      const eventCreator = usersData.find(
        (user) => user.id === eventData.createdBy
      );

      setEvent(eventData);
      setCategories(categoriesData);
      setUser(eventCreator);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    fetchEventData(); // Refresh event data when modal is closed
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  const matchedCategories = categories.filter((category) =>
    event.categoryIds.map(String).includes(String(category.id))
  );

  const categoryNames = matchedCategories
    .map((category) => category.name)
    .join(", ");

  return (
    <Box bg="blue.50" p="4" maxW="700px" mx="auto">
      <VStack spacing="6">
        <Heading as="h1" size="xl">
          {event.title}
        </Heading>
        <Text>{event.description}</Text>
        <Image src={event.image} alt={event.title} />
        <Text>
          <b>Start Time:</b> {formatDate(event.startTime)}
        </Text>
        <Text>
          <b>End Time:</b> {formatDate(event.endTime)}
        </Text>
        <Text>
          <b>Location:</b> {event.location}
        </Text>
        <Text>
          <b>Categories:</b> {categoryNames}
        </Text>
        {user && (
          <VStack spacing="2" align="start">
            <Text fontWeight="bold">Created by:</Text>
            <Box>
              <Image
                src={user.image}
                alt={user.name}
                boxSize="50px"
                borderRadius="full"
              />
              <Text>{user.name}</Text>
            </Box>
          </VStack>
        )}
        <Divider />
        <HStack spacing="4" mt="4" justifyContent="flex-start">
          <Link to={`/`}>
            <Button colorScheme="teal">Go Back</Button>
          </Link>
          <DeleteButton eventId={eventId} />
          <Button colorScheme="teal" onClick={handleEdit}>
            Edit Event
          </Button>
        </HStack>
      </VStack>
      {isEditModalOpen && (
        <EventEditModal
          event={event}
          onClose={handleCloseEditModal}
          onUpdateEvents={fetchEventData}
        />
      )}
    </Box>
  );
};

