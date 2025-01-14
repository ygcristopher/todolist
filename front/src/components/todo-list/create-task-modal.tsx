"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/interceptor";

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
  const [priority, setPriority] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [category, setCategory] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      const user = jwtDecode<{ id: string }>(getToken);
      setUserId(user.id);
    }
  }, []);

  const createTask = async () => {
    try {
      const response = await api.post(
        `/create-task/${userId}`,
        { title, description, priority, category },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error || "An error occurred",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: data.message,
        variant: "success",
      });

      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Error created task", error);
      toast({
        title: "Error",
        description: "Internal server error. Please try again later.",
        variant: "error",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
      <DialogContent className="fixed bg-white p-4 rounded shadow-lg max-w-md w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <DialogTitle className="text-lg font-bold mb-4">
          Adicionar Tarefa
        </DialogTitle>
        <div className="space-y-4">
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 p-2 rounded text-black bg-white"
          />
          <Input
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 p-2 rounded text-black bg-white"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 rounded bg-gray-100 w-full"
          >
            <option value="">Selecione a prioridade</option>
            <option value="BAIXA" className="bg-green-200">BAIXA</option>
            <option value="MÉDIA" className="bg-yellow-200">MÉDIA</option>
            <option value="ALTA" className="bg-red-200">ALTA</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded bg-gray-100 w-full"
            >
            <option value="">Selecione a categoria</option>
            <option value="Codificação">Codificação</option>
            <option value="Revisão" >Revisão</option>
            <option value="Gerenciamento">Gerenciamento</option>
            <option value="Testes">Testes</option>
            <option value="Deploy">Deploy</option>
            </select>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={createTask} disabled={!title || !description || !priority || !category}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
