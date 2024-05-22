import React, { useState } from "react";
import { EventEditForm } from "./EventEditForm";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

export const EventEditModal = ({ event, onClose, onUpdateEvents }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalBody>
            <EventEditForm event={event} onClose={handleClose} onUpdateEvents={onUpdateEvents} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

