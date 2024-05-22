import React from "react";
import { Link } from "react-router-dom";
import { Heading, Card, Text, Image } from "@chakra-ui/react";

export const EventDetail = ({ event, categories }) => {
  console.log("event:", event);
  console.log("categories:", categories);

  // Controleer of event en categories correct zijn gedefinieerd
  if (!event || !categories) {
    return <div>Loading...</div>;
  }

  // Filter de categorieën die overeenkomen met de categorie-IDs van het evenement
  const matchedCategories = categories.filter((category) => {
    return event.categoryIds.includes(category.id);
  });

  // Verkrijg de namen van de overeenkomende categorieën
  const categoryNames = matchedCategories
    .map((category) => category.name)
    .join(", ");

  // Functie om tijd te formatteren naar 24-uursnotatie
  const formatTime = (dateTimeString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleTimeString(undefined, options);
  };
  return (
    <Link to={`/event/${event.id}`} style={{ textDecoration: "none" }}>
      <Card
        minWidth="300px"
        maxWidth="300px"
        padding={3}
        height="450px"
        _hover={{ boxShadow: "lg" }}
      >
        <Heading size="md" mb={2}>
          {event.title}
        </Heading>
        <Text mb={2}>{event.description}</Text>
        <Image
          src={event.image}
          alt={event.title}
          mb={2}
          width="100%"
          height="200px"
          objectFit="cover"
        />
        <Text mb={1}>
          <strong>Start:</strong> {formatTime(event.startTime)}
        </Text>
        <Text mb={1}>
          <strong>End:</strong> {formatTime(event.endTime)}
        </Text>
        <Text mb={1}>
          <strong>Categories:</strong> {categoryNames}
        </Text>
      </Card>
    </Link>
  );
};
