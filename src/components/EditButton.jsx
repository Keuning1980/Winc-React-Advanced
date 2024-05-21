// EditButton.jsx

import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventEditModal } from "./EventEditModal";

const EditButton = ({ eventId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button colorScheme="blue" onClick={openModal}>
        Edit
      </Button>
      {isModalOpen && (
        <EventEditModal
          eventId={eventId}
          onClose={closeModal}
          onUpdateEvents={() => {}} // Voeg hier de logica toe om evenementen bij te werken indien nodig
        />
      )}
    </>
  );
};

export default EditButton; // Zorg ervoor dat EditButton als standaard wordt geëxporteerd
