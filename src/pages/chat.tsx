import { useState, ChangeEvent, FC } from "react";

interface Message {
  sender: string;
  message: string;
}

export const ChatPage: FC = () => {
  const [message, setMessage] = useState<string>("");
  const [chatLog, setChatLog] = useState<Message[]>([]);

  const handleSendMessage = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });
      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      if (data.result) {
        setChatLog((prevLog) => [...prevLog, { sender: "ChatGPT", message: data.result }]);
      } else if (data.error) {
        setChatLog((prevLog) => [...prevLog, { sender: "error", message: data.error.message }]);
        console.error(data.error.message);
      } else {
        setChatLog((prevLog) => [...prevLog, { sender: "error", message: "response data has no elements" }]);
      }
    } catch (error: any) {
      console.error(error);
      setChatLog((prevLog) => [...prevLog, { sender: "error", message: error.message }]);
    }

    setMessage("");
  };

  const handleChange = (error: ChangeEvent<HTMLInputElement>) => {
    setMessage(error.target.value);
  };

  return (
    <div>
      <div>
        {chatLog.map((chat, index) => (
          <p key={index}><strong>{chat.sender}:</strong> {chat.message}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="send a message"
      />
      <button onClick={handleSendMessage}>send</button>
    </div>
  );
};

export default ChatPage; 
