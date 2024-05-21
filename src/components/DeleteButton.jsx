import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const DeleteButton = ({ eventId }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const deleteEvent = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      navigate("/"); // Redirect to the home page after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Button mt={4} colorScheme="red" onClick={deleteEvent}>
      Delete Event
    </Button>
  );
};

export default DeleteButton;
