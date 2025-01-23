"use client";

import React, { useState } from "react";
import styles from "./MarkdownDialog.module.scss";

//Shadcn
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import LabelCalendar from "../calendar/LabelCalendar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

//Markdown
import MDEditor from "@uiw/react-md-editor";

//supabase
import { supabase } from "@/utils/supabase";

export default function MarkdownDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string | undefined>("");

  const { toast } = useToast();

  // 모달창 초기화 함수
  const resetDialog = () => {
    setTitle("");
    setContent("");
    setOpen(false);
  };

  // supabase에 저장
  const onSubmit = async () => {
    console.log("함수 호출");

    if (!title || !content) {
      toast({
        title: "기입되지 않은 데이터가 있습니다.",
        description: "제목, 날짜, 콘텐츠 값을 모두 작성해주세요.",
      });
      return;
    } else {
      const { error, status } = await supabase
        .from("todos")
        .insert([{ title: title, content: content }])
        .select();

      if (error) {
        toast({
          title: "에러 발생",
          description: "데이터 저장 실패, 콘솔창을 확인하세요.",
        });
      }

      if (status === 201) {
        toast({
          title: "저장 완료",
          description: "작성한 글이 저장되었습니다.",
        });
        resetDialog();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetDialog();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Add Contents
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog__titleBox}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder="Write a title for your board."
                className={styles.dialog__titleBox__title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog__calendarBox}>
            <LabelCalendar label="From" />
            <LabelCalendar label="To" />
          </div>
          <Separator />
          <div className={styles.dialog__markdown}>
            <MDEditor
              height={100 + "%"}
              value={content}
              onChange={setContent}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button
                variant={"ghost"}
                className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type={"submit"}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-500 hover:text-white"
              onClick={onSubmit}
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
