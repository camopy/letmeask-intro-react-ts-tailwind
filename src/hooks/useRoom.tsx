import { collection, doc, getDoc, onSnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";
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

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

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

  return {
    questions,
    title,
  };
}
