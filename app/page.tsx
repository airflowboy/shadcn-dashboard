"use client";

import styles from "@/app/page.module.scss";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  //페이지 생성 및 supabase 연동
  const onCreate = async () => {
    const { error, status } = await supabase
      .from("todos")
      .insert({
        title: "",
        start_date: new Date(),
        end_date: new Date(),
        contents: [],
      })
      .select();

    if (error) {
      console.log(error);
    }

    const { data } = await supabase.from("todos").select("*");

    if (status === 201) {
      toast({
        title: "페이지 생성 완료",
        description: "새로운 Todo 리스트가 생성되었습니다.",
      });

      if (data) {
        router.push(`/create/${data[data.length - 1].id}`);
      } else {
        return;
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__onBoarding}>
        <span className={styles.container__onBoarding__title}>
          How to Start:
        </span>
        <div className={styles.container__onBoarding__steps}>
          <span>1. Create a page</span>
          <span>2. Add boards to page</span>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          variant="outline"
          className="w-full bg-transparent text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
          onClick={onCreate}
        >
          Add New Page
        </Button>
      </div>
    </div>
  );
}
