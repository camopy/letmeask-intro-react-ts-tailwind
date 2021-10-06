import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { useHistory, useParams } from "react-router";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useRoom } from "../hooks/useRoom";
import { db } from "../services/firebase";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const history = useHistory();

  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Are you sure that you want to delete this question?")) {
      return deleteDoc(doc(db, `rooms/${roomId}/questions/${questionId}`));
    }
  }

  async function handleCloseRoom(roomId: string) {
    await updateDoc(doc(db, `rooms/${roomId}`), { closedAt: new Date() });

    history.push("");
  }

  return (
    <div className="h-screen">
      <header className="p-6 border-b">
        <div className="flex flex-col items-center justify-between max-w-6xl gap-2 mx-auto md:flex-row">
          <img className="max-h-11" src={logoImg} alt="Letmeask" />
          <div className="flex flex-col gap-2 md:flex-row">
            <RoomCode code={roomId} />
            <Button
              onClick={() => handleCloseRoom(roomId)}
              className="h-10 text-purple-500 bg-white border border-purple-500"
            >
              Close room
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl p-2 mx-auto">
        <div className="flex items-center my-8">
          <h1 className="text-2xl text-gray-700">Room {title}</h1>
          {questions.length > 0 && (
            <span className="px-4 py-2 ml-4 text-sm font-medium text-gray-100 bg-pink-400 rounded-full">
              {questions.length} Question{questions.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="mt-8">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="flex items-end gap-2 font-medium text-gray-400 bg-transparent border-0 cursor-pointer"
                  type="button"
                  aria-label="Deletar"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 5.99988H5H21"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
