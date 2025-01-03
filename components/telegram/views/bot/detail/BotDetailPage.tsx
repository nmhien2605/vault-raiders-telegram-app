"use client";

import { useEffect, useState } from "react";

import { closeMiniApp } from "@telegram-apps/sdk-react";
import Image from "next/image";

import CoinAmount from "@/components/common/CoinAmount";
import DialogPassword from "@/components/common/DialogPassword";
import { GameButton } from "@/components/core/button";
import { useBotBuyTicket } from "@/hooks/api/useBotBuyTicket";
import { useBotDetail } from "@/hooks/api/useBotDetail";
import { useBotStart } from "@/hooks/api/useBotStart";
import { Link, useParams } from "@/i18n/routing";
import { calcRemainingHours, formatTimestampToObj } from "@/utils/time";

import Tab from "./tabs/Tab";
import TabAbout from "./tabs/TabAbout";
import TabChatHistory from "./tabs/TabChatHistory";

const BotDetailPage = () => {
  const params = useParams();
  const botId = (params.botId as string) || "";

  const { data: botData } = useBotDetail({ botId });
  const { mutateAsync: buyTicket } = useBotBuyTicket();
  const { mutateAsync: startBot } = useBotStart();

  const [tab, setTab] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [buying, setBuying] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>();

  useEffect(() => {
    if (botData?.lastRejectedAt && botData?.isActive) {
      const remaining = calcRemainingHours(botData?.lastRejectedAt, 12);
      if (remaining <= 0) {
        setTimeRemaining(0);
        return;
      }
      setTimeRemaining(Math.round(remaining / 1000));
    }
  }, [botData?.lastRejectedAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the countdown when it reaches zero
          return 0;
        }
        return prevTime - 1; // Decrease the time by 1 second
      });
    }, 1000);
    return () => clearInterval(timer); // Cleanup the interval on unmount
  }, []);

  const DisplayCountdown = ({ timeRemaining }: { timeRemaining: number }) => {
    const time = formatTimestampToObj(timeRemaining);
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes
      .toString()
      .padStart(2, "0")}:${time.secs.toString().padStart(2, "0")}`;
  };

  const handleStartChat = async () => {
    await startBot({ botId });
    closeMiniApp();
  };

  const handleBuyTicket = async (password: string) => {
    if (buying) return;
    setBuying(true);

    try {
      const { message } = await buyTicket({ botId, password });

      if (message === "success") {
        await handleStartChat();
      } else {
        alert("Buy ticket failed!");
      }
    } catch {}

    setBuying(false);
  };
  return (
    <div>
      <div className="fixed left-0 right-0 top-0 z-20 grid grid-cols-3 rounded-bl-[1.25rem] border-b border-primary/25 bg-gray-950 py-1">
        <Link href="/">
          <div className="h-16">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              fill
              className="!static h-16 w-auto object-contain"
            />
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center text-primary">
          <div
            className="text-sm"
            style={{
              fontFamily: "Luminari",
            }}
          >
            Vault value
          </div>
          <CoinAmount amount={botData?.balance} className="text-4xl" />
        </div>
        {timeRemaining ? (
          <div className="flex flex-col items-center justify-center">
            <div
              className="text-sm"
              style={{
                fontFamily: "Luminari",
              }}
            >
              Time Remaining
            </div>
            <div
              className="flex items-center gap-1 text-xl text-red-500"
              style={{
                fontFamily: "Luminari",
              }}
            >
              <DisplayCountdown timeRemaining={timeRemaining} />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-col items-center gap-3 pt-20">
        <Tab tab={tab} setTab={setTab} />

        {tab === 0 ? (
          <TabChatHistory botId={botId} />
        ) : (
          <TabAbout botId={botId} />
        )}
      </div>
      {botData?.isActive ? (
        <div
          className="fixed bottom-0 left-0 right-0 z-10 space-y-3 bg-gradient-to-t from-[#3C2E1C] to-[#745A3A] px-4 pb-5 pt-2.5"
          style={{
            fontFamily: "Luminari",
          }}
        >
          {botData?.hasActiveTicket ? (
            <GameButton onClick={handleStartChat}>Send a message...</GameButton>
          ) : (
            <GameButton
              onClick={() => setOpenDialog(true)}
              disabled={buying}
              className="text-base"
            >
              {buying ? (
                "..."
              ) : (
                <>
                  Pay
                  <CoinAmount
                    amount={botData?.ticketPrice}
                    normalFont
                    className="mx-1.5 text-base text-current"
                  />
                  to send a message...
                </>
              )}
            </GameButton>
          )}
          <div className="text-center text-sm text-[#BEB7B1]">
            70% of your fee goes to the prize pool
          </div>
        </div>
      ) : (
        <></>
      )}

      <DialogPassword
        open={openDialog}
        onOpenChange={setOpenDialog}
        onConfirm={handleBuyTicket}
      />
    </div>
  );
};

export default BotDetailPage;
