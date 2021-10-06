import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { db, addDoc, collection } from "../services/firebase";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [roomName, setRoomName] = useState("");

  async function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (roomName.trim() === "") {
      return;
    }

    const data = {
      name: roomName,
      authorId: user?.id,
    };

    const firebaseRoom = await addDoc(collection(db, "rooms"), data);

    history.push(`/rooms/${firebaseRoom.id}`);
  }

  return (
    <div className="flex items-stretch h-screen">
      <aside className="flex flex-col justify-center w-2/5 px-32 text-white bg-purple-500">
        <img
          className="max-w-xs"
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong className="mt-8 text-4xl leading-10 text-gray-50">
          Crie salas de Q&amp;A ao-vivo
        </strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main className="flex items-center justify-center w-3/5 px-20">
        <div className="flex flex-col items-stretch w-full max-w-xs text-center">
          <img src={logoImg} alt="Letmeask" className="self-center" />

          <h2 className="mt-16 mb-6 text-2xl">Criar uma nova sala</h2>

          <form onSubmit={handleCreateRoom}>
            <input
              className="w-full h-12 px-4 bg-white border border-gray-300 border-solid rounded-lg"
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomName(event.target.value)}
              value={roomName}
            />
            <Button className="w-full mt-4" type="submit">
              Criar sala
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-400">
            Quer entrar em uma sala existente?{" "}
            <Link className="text-pink-300" to="/">
              clique aqui
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
