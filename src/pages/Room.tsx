import { addDoc, collection, doc, updateDoc } from "@firebase/firestore";
import { FormEvent, useState } from "react";
import { useParams } from "react-router";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { db } from "../services/firebase";

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");

  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleSubmitNewQUestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in ");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
      likes: [],
    };

    await addDoc(collection(db, `rooms/${roomId}/questions`), question);

    setNewQuestion("");
  }

  async function handleLikeQuestion(
    questionId: string,
    hasLiked: boolean,
    likes: Array<string>
  ) {
    if (user?.id) {
      if (hasLiked) {
        likes = likes.filter((like) => like !== user.id);
        return updateDoc(doc(db, `rooms/${roomId}/questions/${questionId}`), {
          likes,
        });
      }

      likes.push(user.id);
      return updateDoc(doc(db, `rooms/${roomId}/questions/${questionId}`), {
        likes,
      });
    }
  }

  return (
    <div className="h-screen">
      <header className="p-6 border-b">
        <div className="flex flex-col items-center justify-between max-w-6xl gap-2 mx-auto md:flex-row">
          <img className="max-h-11" src={logoImg} alt="Letmeask" />
          <div className="flex gap-2">
            <RoomCode code={roomId} />
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

        <form onSubmit={handleSubmitNewQUestion}>
          <textarea
            className="w-full p-4 border-0 rounded-lg shadow-lg resize-y bg-gray-50"
            placeholder="O que você quer perguntar?"
            onChange={(e) => setNewQuestion(e.target.value)}
            value={newQuestion}
          ></textarea>

          <div className="flex items-center justify-between mt-4">
            {user ? (
              <div className="flex items-center">
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.avatar}
                  alt=""
                />
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {user.name}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-400">
                Para enviar uma pergunta,
                <button className="ml-1 text-sm font-medium text-purple-500 underline bg-transparent border-0 cursor-pointer">
                  faça seu login
                </button>
                .
              </span>
            )}
            <Button disabled={!user} type="submit">
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="mt-8">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  onClick={() =>
                    handleLikeQuestion(
                      question.id,
                      question.hasLiked,
                      question.likes || []
                    )
                  }
                  className="flex items-end gap-2 font-medium text-gray-400 bg-transparent border-0 cursor-pointer"
                  type="button"
                  aria-label="Marcar como gostei"
                >
                  {question.likeCount > 0 && (
                    <span className={question.hasLiked ? "#8B5CF6" : "#9CA3AF"}>
                      {question.likeCount}
                    </span>
                  )}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke={question.hasLiked ? "#8B5CF6" : "#9CA3AF"}
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
