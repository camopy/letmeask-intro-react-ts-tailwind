import { useParams } from "react-router";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();

  return (
    <div>
      <header className="p-6 border-b">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <img className="max-h-11" src={logoImg} alt="Letmeask" />
          <div className="flex gap-2">
            <RoomCode code={params.id} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex items-center my-8">
          <h1 className="text-2xl text-gray-700">Sala</h1>
          <span className="px-4 py-2 ml-4 text-sm font-medium text-gray-100 bg-pink-400 rounded-full">
            4 perguntas
          </span>
        </div>

        <form>
          <textarea
            className="w-full p-4 border-0 rounded-lg shadow-lg resize-y bg-gray-50"
            placeholder="O que você quer perguntar:"
          ></textarea>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-gray-400">
              Para enviar uma pergunta,
              <button className="ml-1 text-sm font-medium text-purple-500 underline bg-transparent border-0 cursor-pointer">
                faça seu login
              </button>
              .
            </span>
            <Button type="submit">Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
