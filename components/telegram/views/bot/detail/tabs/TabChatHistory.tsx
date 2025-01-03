"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useBotChatHistory } from "@/hooks/api/useBotChatHistory";
import { useBotDetail } from "@/hooks/api/useBotDetail";
import { cn } from "@/libs/utils";
import BotMessage from "../components/BotMessage";
import UserMessage from "../components/UserMessage";
import { includeHttps, isURL } from "@/utils/url";

const TabChatHistory = ({ botId }: { botId: string }) => {
  const { data: botData } = useBotDetail({ botId });
  const { data: chatData } = useBotChatHistory({ botId });
  const [enableScroll, setEnableScroll] = useState<boolean>(false);
  const handleScrollEvent = () => {
    const chatScroll = document.getElementById("chat-scroll");
    if (chatScroll) {
      const top = chatScroll.getBoundingClientRect().top;

      if (top < 114) {
        setEnableScroll(true);
      } else {
        setEnableScroll(false);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("scroll", handleScrollEvent);

    return () => {
      document.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  const WinnerCard = () => {
    return (
      <div
        className="flex flex-col items-center justify-center gap-1 text-sm"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #665D4F 54%, rgba(0, 0, 0, 0) 100%)",
          borderWidth: "2px 0px 2px 0px",
          borderStyle: "solid",
          borderColor: "black",
          borderImageSource:
            "linear-gradient(90deg, #584629 0%, #9B873E 48.5%, #584629 100%)",
          borderImageSlice: 30,
          backgroundBlendMode: "screen",
        }}
      >
        <>
          <p style={{ fontFamily: "Luminari" }} className="text-[#CFCFCF]">
            Winner
          </p>

          <div
            className="h-2 w-32"
            style={{
              background:
                "radial-gradient(  50.02% 49.99% at 50.36% 50.05%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 5%, rgba(255, 255, 255, 0.6) 9%, rgba(255, 255, 255, 0.5) 14%, rgba(255, 255, 255, 0.4) 20%, rgba(255, 255, 255, 0.3) 26%, rgba(255, 255, 255, 0.2) 32%, rgba(255, 255, 255, 0.15) 40%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 63%, rgba(255, 255, 255, 0) 100%)",
            }}
          ></div>
          <p
            style={{
              fontFamily: "MicroGrotesk",
            }}
            className="text-[#BEB7B1]"
          >
            {botData?.winnerAddress}
          </p>
        </>
      </div>
    );
  };
  const WinnerFooter = ({ botName }: { botName: string }) => {
    return (
      <div
        className="fixed bottom-0 left-0 flex h-40 w-full flex-col gap-3 bg-black p-3"
        style={{
          background: "linear-gradient(180deg, #9F804B 0%, #20180E 100%)",
        }}
      >
        <p
          style={{
            fontFamily: "MicroGrotesk",
          }}
          className="text-center text-sm font-[200] text-white"
        >
          {botName || "This character"} is grateful for the brave humans who
          engaged. We will meet again.
        </p>
        <WinnerCard />
      </div>
    );
  };
  const Background = () => {
    return (
      <div
        className="absolute"
        style={{
          width: "648.6px",
          height: "365.79px",
          left: "-79.21px",
          top: "10px",
          gap: "0px",
          opacity: "0px",
          rotate: "9.82 deg",
        }}
      >
        <Image src="/assets/bg-chat.png" alt="Background Chat" fill />
      </div>
    );
  };

  return (
    <>
      {/* <Background /> */}
      <div className="relative z-10 overflow-hidden text-[#493010]">
        {botData?.isActive !== undefined && (
          <div className="absolute left-1/2 top-0 -z-10 w-[107%] -translate-x-1/2">
            <Image
              src={
                !botData?.isActive
                  ? "/assets/history-scroll.png"
                  : "/assets/scroll.png"
              }
              alt="Chat History"
              fill
              className="!static h-auto w-full object-contain"
            />
          </div>
        )}
        <div className="z-10 flex h-16 items-center justify-center">
          <div
            className="text-center text-3xl tracking-wider"
            style={{
              fontFamily: "JimNightshade",
            }}
          >
            - {botData?.displayName} -
          </div>
        </div>
        <div className="px-6 py-3 text-center">
          {botData?.additionalInstructions}
        </div>
        <div className="h-10 w-full">
          <Image
            src="/assets/scroll-line.png"
            alt="Scroll"
            fill
            className="!static h-full w-auto object-contain"
          />
        </div>
        <div
          id="chat-scroll"
          className={cn(
            "no-scrollbar h-[calc(100dvh-7rem)] overflow-hidden",
            enableScroll && "overflow-y-auto",
          )}
        >
          <div className="space-y-5 px-6 pb-40">
            {chatData?.map((message, i) =>
              message?.senderRole === "bot" ? (
                <BotMessage
                  key={i}
                  message={message}
                  botAvatar={
                    includeHttps(botData?.photoUrl)
                      ? botData?.photoUrl
                      : `https://storage.googleapis.com/vault-raiders/${botData?.photoUrl}`
                  }
                />
              ) : (
                <UserMessage
                  key={i}
                  message={message}
                  isWinnerMessage={botData?.winMessageId == message.id}
                />
              ),
            )}
          </div>
        </div>
        {botData?.isActive == false && (
          <WinnerFooter botName={botData.displayName} />
        )}
      </div>
    </>
  );
};

export default TabChatHistory;
