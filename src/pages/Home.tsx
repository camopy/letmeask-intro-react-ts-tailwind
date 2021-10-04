import { useHistory } from "react-router";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { db, doc, getDoc } from "../services/firebase";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = doc(db, `rooms/${roomCode}`);
    const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists()) {
      alert("Room does not exist");
      return;
    }

    history.push(`/rooms/${roomCode}`);
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

          <button
            onClick={handleCreateRoom}
            className="flex items-center justify-center h-12 gap-2 px-8 py-2 mt-16 mb-6 font-medium text-white bg-red-500 border-0 rounded-lg cursor-pointer hover:transition-opacity hover:opacity-90"
          >
            <img className="mr-2" src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className="flex items-center justify-between mb-4 space-x-2">
            <span className="flex-grow border-b-2 border-gray-300"></span>
            <div>ou entre em uma sala</div>
            <span className="flex-grow border-b-2 border-gray-300"></span>
          </div>

          <form onSubmit={handleJoinRoom}>
            <input
              className="w-full h-12 px-4 bg-white border border-gray-300 border-solid rounded-lg"
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <div className="w-full mt-4">
              <Button type="submit">Entrar na sala</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
