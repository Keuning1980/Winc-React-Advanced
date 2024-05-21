import React, { useState } from "react";
import { EventForm } from "./EventForm";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

export const MyModal = ({ addEvent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleUpdateEvents = (newEvent) => {
    addEvent(newEvent);
  };

  return (
    <>
      <Button bgColor="White" maxHeight="40px" onClick={toggleModal} size="lg">
        Add Event
      </Button>
      <Modal isOpen={isOpen} onClose={toggleModal} size="xl">
        <ModalOverlay />
        <ModalContent
          p={4}
          mx="auto" // Center horizontally
          my={{ base: 4, md: 0 }} // Vertical margins
          maxWidth="xl" // Maximum width
          width="90%" // Responsive width
        >
          <ModalHeader>Add Event</ModalHeader>
          <ModalBody>
            <EventForm onClose={toggleModal} onUpdateEvents={handleUpdateEvents} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={toggleModal} size="lg">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

