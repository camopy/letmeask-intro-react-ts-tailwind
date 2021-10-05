type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
};

export function Question({ content, author }: QuestionProps) {
  return (
    <div className="p-6 mt-2 rounded-lg shadow-lg bg-gray-50">
      <p className="text-gray-600">{content}</p>
      <footer className="flex items-center justify-between mt-6">
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full"
            src={author.avatar}
            alt={author.name}
          />
          <span className="ml-2 text-sm text-gray-600">{author.name}</span>
        </div>
      </footer>
    </div>
  );
}
