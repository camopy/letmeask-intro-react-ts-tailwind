import copyImg from "../assets/images/copy.svg";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button
      onClick={copyRoomCodeToClipboard}
      className="flex h-10 bg-white border border-purple-500 rounded-lg cursor-pointer"
    >
      <div className="flex items-center justify-center h-full px-3 bg-purple-500 rounded-l-lg">
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span className="self-center flex-1 block px-3 py-4 text-sm font-medium w-60">
        Sala #{props.code}
      </span>
    </button>
  );
}
