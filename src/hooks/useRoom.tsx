import { collection, doc, getDoc, onSnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Array<string>;
  likeCount: number;
  hasLiked: boolean;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
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
      const questions = Object.entries(snapshot.docs).map(([_, value]) => {
        const firebaseQuestion = value.data();
        const question: QuestionType = {
          id: value.id,
          content: firebaseQuestion.content,
          isAnswered: firebaseQuestion.isAnswered,
          isHighlighted: firebaseQuestion.isHighlighted,
          author: firebaseQuestion.author,
          likes: firebaseQuestion.likes,
          likeCount: Object.values(firebaseQuestion.likes ?? {}).length,
          hasLiked:
            firebaseQuestion.likes && user?.id
              ? Object.values(firebaseQuestion.likes).some(
                  (like) => like === user.id
                )
              : false,
        };

        return question;
      });

      Promise.all(questions).then((questions) => {
        setQuestions(questions);
      });
    });

    return () => {
      unsubscribeQuestions();
    };
  }, [roomId, user?.id]);

  return {
    questions,
    title,
  };
}
