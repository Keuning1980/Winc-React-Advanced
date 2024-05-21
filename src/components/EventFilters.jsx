import React from "react";
import { Flex, Box, Input, Select } from "@chakra-ui/react";

const EventFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <Flex mb={4} gap={4}>
      <Box bg="white" minWidth="350px" flex="1">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Box>
        <Select minWidth="350px" 
          bg="white"
          placeholder="Filter by category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Box>
    </Flex>
  );
};

export default EventFilters;
