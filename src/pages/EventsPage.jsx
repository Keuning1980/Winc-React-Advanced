import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Heading,
  Box,
  Container,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import { EventDetail } from "../components/EventDetail";
import { MyModal } from "../components/Modal";
import EventFilters from "../components/EventFilters";

export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const categoriesResponse = await fetch("http://localhost:3000/categories");

  return {
    events: await eventsResponse.json(),
    categories: await categoriesResponse.json(),
  };
};

export const EventsPage = () => {
  const { events: initialEvents, categories } = useLoaderData();
  const [events, setEvents] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const filterEvents = (events) => {
    return events.filter((event) => {
      const matchesSearchQuery = event.title
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase())
        : false;
      const matchesCategory = selectedCategory
        ? event.categoryIds.includes(parseInt(selectedCategory))
        : true;
      return matchesSearchQuery && matchesCategory;
    });
  };

  const filteredEvents = filterEvents(events);

  return (
    <Box bg="blue.50" minH="100vh" py={10}>
      <Container maxW="container.lg">
        <Heading mb={4} textAlign="center">
          List of Events
        </Heading>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          alignItems={{ base: "stretch", md: "center" }}
          mb={6}
          wrap="wrap"
        >
          <Box
            mb={{ base: 4, md: 0 }}
            flex={{ base: "1 1 300px", md: "0 1 300px" }}
          >
            <EventFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
            <MyModal addEvent={addEvent} />
          </Box>
        </Flex>

        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {filteredEvents.map((event) => (
            <GridItem key={event.id}>
              <EventDetail event={event} categories={categories} />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

