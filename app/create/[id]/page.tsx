"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/create/[id]/page.module.scss";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import LabelCalendar from "@/components/common/calendar/LabelCalendar";

import BasicBoard from "@/components/common/board/BasicBoard";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase";
import Image from "next/image";

import { nanoid } from "nanoid";

interface Todo {
  id: number;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  contents: BoardContent[];
}

interface BoardContent {
  boardId: string | number;
  isCompleted: boolean;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string;
}

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const [boards, setBoards] = useState<Todo>();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  // supabase 기존에 생성된 보드가 있는지 확인
  const getData = async () => {
    let { data, error, status } = await supabase.from("todos").select("*");

    if (data !== null) {
      data.forEach((todo) => {
        if (todo.id === pathname.split("/")[2]) {
          setBoards(todo);
        }
      });
    }
  };

  const insertRowData = async (contents: BoardContent[]) => {
    //supabase db에 연동
    if (boards?.contents) {
      const { data, error, status } = await supabase
        .from("todos")
        .update({
          contents: contents,
        })
        .eq("id", pathname.split("/")[2])
        .select();

      if (error) {
        console.log(error);
        toast({
          title: "에러 발생",
          description: "데이터 업데이트 실패",
        });
      }

      if (status === 200) {
        toast({
          title: "추가 완료",
          description: "데이터 추가 완료",
        });

        getData();
      }
    } else {
      if (boards?.contents) {
        const { data, error, status } = await supabase
          .from("todos")
          .insert({
            contents: contents,
          })
          .eq("id", pathname.split("/")[2])
          .select();

        if (error) {
          console.log(error);
          toast({
            title: "에러 발생",
            description: "데이터 저장 실패",
          });
        }

        if (status === 201) {
          toast({
            title: "생성 완료",
            description: "데이터 저장 완료",
          });

          getData();
        }
      }
    }
  };

  // Add New Board 버튼 클릭했을때
  const createBoard = () => {
    let newContents: BoardContent[] = [];
    const BoardContent = {
      boardId: nanoid(),
      isCompleted: false,
      title: "",
      startDate: "",
      endDate: "",
      content: "",
    };

    if (boards && boards.contents.length > 0) {
      newContents = [...boards.contents];
      newContents.push(BoardContent);
      insertRowData(newContents);
    } else if (boards && boards.contents.length === 0) {
      newContents.push(BoardContent);
      insertRowData(newContents);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.container__header__contents}>
          <input
            type="text"
            placeholder="Enter Title Here"
            className={styles.input}
          />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 completed</span>
            {/* 프로그레스 바 UI */}
            <Progress
              value={33}
              className="w-[30%] h-2"
              indicatorColor="bg-green-500"
            />
          </div>
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox__calendar}>
              {/* 캘린더 UI */}
              <LabelCalendar label="From" />
              <LabelCalendar label="To" />
            </div>
            <Button
              variant="outline"
              className="w-[15%] border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
              onClick={createBoard}
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.container__body}>
        {boards?.contents.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className={styles.container__body__infoBox}>
              <span className={styles.title}>There is no board yet.</span>
              <span className={styles.subTitle}>
                Click the button and start flashing!
              </span>
              <button className={styles.button}>
                <Image
                  src="/assets/images/add.svg"
                  alt="add"
                  width={100}
                  height={100}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start w-full h-full gap-4">
            {boards?.contents.map((board) => {
              return <BasicBoard key={board.boardId} />;
            })}
          </div>
        )}
      </main>
    </div>
  );
}
