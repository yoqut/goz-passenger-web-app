import Loader from "@/shared/components/Loader";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { messages as messag } from "../../constants";
import { MessageInput } from "../input";
import { Message } from "../message";

export const MessageList = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(messag);
  const [hasMore, setHasMore] = useState(false);

  const fetchMoreMessages = () => {
    // Simulate API call to fetch older messages
    setTimeout(() => {
      // Append new messages
      const randomMessage = Math.floor(Math.random() * 10000);
      const newMessages = {
        text: `${randomMessage}`,
        time: "10:00",
        isSender: false,
      };

      setMessages((prevMessages) => [newMessages, ...prevMessages]);
      if (messages.length >= 50) {
        setHasMore(false);
      }
    }, 500);
  };

  const gotoBottom = () => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  };

  const sendMessage = () => {
    // Simulate API call to send message
    const newMessage = {
      text: message,
      time: "10:00",
      isSender: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    // fetchMoreMessages(); // Initial load
    gotoBottom();
  }, [messages]);
  return (
    <>
      <div id="scrollableDiv" className="flex gap-2 h-full overflow-y-auto ">
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          loader={<Loader />}
          scrollThreshold={"100px"}
          className="flex flex-col-reverse"
          inverse={true} // Enable reverse scrolling
          scrollableTarget="scrollableDiv"
        >
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {messages.map((msg, index) => (
              <Message
                key={index}
                text={msg.text}
                time={msg.time}
                isSender={msg.isSender}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
      <MessageInput onInputChange={setMessage} onSubmit={sendMessage} />
    </>
  );
};
