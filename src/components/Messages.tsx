import { useEffect, useState, useRef } from "react";
import { getDatabase, ref, onChildAdded, onChildRemoved } from "firebase/database";

type ChatMessage = {
  id: string;
  userId: string;
  nick: string;
  message: string;
  date: number;
  month: number;
  year: number;
  hours: number;
  mins: number;
  isDeleted?: boolean;
  isDeleting?: boolean;
};


function ChatMessages({ userId, onDelete }: any) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const db = getDatabase();

  // child added
  useEffect(() => {
    const chatsRef = ref(db, "Chats");
    setMessages([]);

    const unsubscribe = onChildAdded(chatsRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();

      setMessages((prev) => [
        ...prev,
        {
          id: snapshot.key as string,
          userId: data.userId,
          nick: data.nick,
          message: data.message,
          date: data.date,
          month: data.month,
          year: data.year,
          hours: data.hours,
          mins: data.mins,
          isDeleted: false,
          isDeleting: false,
        },
      ]);
    });

    return () => unsubscribe();
  }, [db]);

  // child removed
  useEffect(() => {
    const chatsRef = ref(db, "Chats");

    const unsubscribe = onChildRemoved(chatsRef, (snapshot) => {
      const removedId = snapshot.key;
      if (!removedId) return;

      // mark as deleted
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === removedId
            ? { ...msg, isDeleted: true, message: "⚠ This message has been removed !" }
            : msg
        )
      );

      // remove after 5 seconds
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== removedId));
      }, 5000);
    });

    return () => unsubscribe();
  }, [db]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // handle delete click
  const handleDelete = async (id: string) => {
    // disable button immediately
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, isDeleting: true } : msg
      )
    );

    try {
      await onDelete(id); // firebase remove
    //    setMessages((prev) =>
    //   prev.map((msg) =>
    //     msg.id === id ? { ...msg, isDeleted: true } : msg
    //   )
    // );
    } catch (err) {
      // re-enable if failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, isDeleting: false } : msg
        )
      );
    }
  };

  return (
    <div className="messings">
      {messages.map((msg) => {
        const isOther = msg.userId !== userId;

        return (
          <div
            key={msg.id}
            className="part"
            style={{
              background: isOther ? "#ff675c" : undefined,
              textAlign: isOther ? "right" : "left",
              opacity: msg.isDeleted ? 0.6 : 1,
            }}
          >
            <h6 style={{ color: isOther ? "#992820" : undefined }}>
              {msg.nick}
            </h6>

            <p>{msg.message}</p>

            <h6>
              {!isOther && !msg.isDeleted && (
                <button
                  disabled={msg.isDeleting}
                  style={{
                    backgroundColor: msg.isDeleting ? "#888" : "#444",
                    padding: "2px 8px",
                    color: "white",
                    fontWeight: 900,
                    border: "none",
                    borderRadius: "20px",
                    cursor: msg.isDeleting ? "not-allowed" : "pointer",
                    marginRight: "6px",
                  }}
                  onClick={() => handleDelete(msg.id)}
                >
                  {msg.isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}

              {msg.hours}:{msg.mins} {msg.date}/{msg.month + 1}/{msg.year}
            </h6>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
