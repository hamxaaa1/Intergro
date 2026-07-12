import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../Skeletons/MessageSkeleton";
import { formatMessageTime } from "../../utils/utils";
import { Trash2, CheckSquare, Square } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    deleteMultipleMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch & subscribe to messages
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    await deleteMultipleMessages(selectedIds);
    setSelectedIds([]);
    setSelectMode(false);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Header */}
      <ChatHeader />

      {/* Delete mode controls */}
      {selectMode && (
        <div className="p-2 flex justify-between items-center bg-base-200">
          <span>{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <button
              className="btn btn-sm bg-red-500 text-white"
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
            >
              Delete
            </button>
            <button
              className="btn btn-sm"
              onClick={() => {
                setSelectMode(false);
                setSelectedIds([]);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isOwn = msg.senderId === authUser._id;
          const isSelected = selectedIds.includes(msg._id);

          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className="relative group w-auto max-w-[80%] p-2 rounded-lg bg-base-200"
                ref={messageEndRef}
              >
                {/* Checkbox in select mode */}
                {selectMode && (
                  <button
                    onClick={() => toggleSelect(msg._id)}
                    className="absolute -left-6 top-1 ml-2"
                  >
                    {isSelected ? (
                      <CheckSquare size={18} className="text-emerald-500" />
                    ) : (
                      <Square size={18} className="text-zinc-400" />
                    )}
                  </button>
                )}

                {/* Message content */}
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
  <img
    src={msg.image}
    alt="Attachment"
    className="mt-2 rounded-xl w-auto max-w-xs md:max-w-sm h-auto"
  />
)}

                {/* Timestamp */}
                <p className="text-xs text-zinc-400 mt-1">
                  {formatMessageTime(msg.createdAt)}
                </p>

                {/* Delete single message (hover, own only) */}
                {isOwn && !selectMode && (
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="absolute top-1 right-1 hidden group-hover:flex 
                               bg-red-500 text-white rounded-full p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Footer */}
      <div className="p-2 flex justify-between items-center border-t border-base-300">
        <button
          className="btn btn-xs"
          onClick={() => setSelectMode((prev) => !prev)}
        >
          {selectMode ? "Exit Select Mode" : "Select Messages"}
        </button>
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
