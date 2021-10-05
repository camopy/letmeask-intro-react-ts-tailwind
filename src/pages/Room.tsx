import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "@firebase/firestore";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { db } from "../services/firebase";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  const roomId = params.id;

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);
    getDoc(roomRef).then((doc) => {
      if (doc.exists()) {
        setTitle(doc.data().name);
      }
    });

    const questionsRef = collection(db, `rooms/${roomId}/questions`);
    const unsubscribeQuestions = onSnapshot(questionsRef, (snapshot) => {
      const questions = Object.entries(snapshot.docs).map(([key, value]) => {
        const data = value.data();
        return {
          id: key,
          content: data.content,
          isAnswered: data.isAnswered,
          isHighlighted: data.isHighlighted,
          author: data.author,
        };
      });
      setQuestions(questions);
    });

    return unsubscribeQuestions;
  }, [roomId]);

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
    };

    await addDoc(collection(db, `rooms/${roomId}/questions`), question);

    setNewQuestion("");
  }

  return (
    <div>
      <header className="p-6 border-b">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <img className="max-h-11" src={logoImg} alt="Letmeask" />
          <div className="flex gap-2">
            <RoomCode code={roomId} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex items-center my-8">
          <h1 className="text-2xl text-gray-700">Sala {title}</h1>
          {questions.length > 0 && (
            <span className="px-4 py-2 ml-4 text-sm font-medium text-gray-100 bg-pink-400 rounded-full">
              {questions.length} perguntas
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
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
