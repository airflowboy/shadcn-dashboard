"use client";

import { Button } from "@/components/ui/button";
import styles from "./SideNavigation.module.scss";
import { Dot, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function SideNavigation() {
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);

  const onCreate = async () => {
    console.log("함수 호출");

    // supabase db에 새로운 row 생성
    const { error, status } = await supabase.from("todos").insert({
      title: "",
      start_date: new Date(),
      end_date: new Date(),
      contents: [],
    });

    if (error) {
      console.log(error);
    }
    if (status === 201) {
      toast({
        title: "생성 완료",
        description: "새로운 Todo 리스트가 생성되었습니다.",
      });
      router.push("/create");
    }
  };

  // supabase에 기존에 생성된 페이지가 있는지 없는지도 체크
  const getTodos = async () => {
    let { data, error, status } = await supabase.from("todos").select("*");

    if (status === 200 && data) {
      setTodos(data);
    }
  };

  useEffect(() => {
    getTodos();
  }, [todos]);

  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
        <Input
          type="text"
          placeholder="검색어를 입력해주세요"
          className="focus-visible:ring-0"
        />
        <Button variant="outline" size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant="outline"
          className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
          onClick={onCreate}
        >
          Add New Page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your To do</span>
        <div className={styles.container__todos__list}>
          {todos &&
            todos.map((todo) => (
              <div
                className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
                key={todo.id}
              >
                <Dot className="mr-1 text-green-400"></Dot>
                <span className="text-sm">
                  {todo.title === "" ? "제목 없음" : todo.title}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
