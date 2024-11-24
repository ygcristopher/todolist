"use client"

import { useEffect, useState } from "react";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateTaskModal = ({
  isOpen,
  onClose,
  onTaskCreated,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      const user = jwtDecode<{ id: string }>(getToken);
      setUserId(user.id);
    }
  }, []);

  const createTask = async () => {
    try {
      await axios.post(
        `http://localhost:3003/create-task/${userId}`,
        { title, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  return (
    <Dialog open={isOpen}>
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold">Adicionar Tarefa</h2>
        <Input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={createTask}>Salvar</Button>
      </div>
    </Dialog>
  );
};

export default CreateTaskModal;
