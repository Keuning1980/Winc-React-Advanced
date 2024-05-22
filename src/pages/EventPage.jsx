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

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchEventAndCategoriesAndUser = async () => {
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

    fetchEventAndCategoriesAndUser();
  }, [eventId]);

  const handleEdit = () => {
    // Voeg hier je bewerkingslogica toe
    // Simuleer een succesvolle of mislukte bewerking
    const editSuccess = true; // Wijzig dit naar false om een mislukte bewerking te simuleren

    if (editSuccess) {
      toast({
        title: "Edit Successful",
        description: "The event has been successfully edited.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Edit Failed",
        description: "An error occurred while editing the event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
          <b>Start Time:</b> {event.startTime}
        </Text>
        <Text>
          <b>End Time:</b> {event.endTime}
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
          <EditButton eventId={eventId} onEdit={handleEdit} />
        </HStack>
      </VStack>
    </Box>
  );
};
