"use client";
import { deleteHabit } from "@/actions/habits";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { toast } from "sonner";
export default function ActionButtons({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteHabit = async (id: number) => {
    setIsDeleting(true);
    const result = await deleteHabit(id);
    if (result.success) {
      toast.success("successfully deleted habit");
    } else {
      toast.error(result.error);
    }
    setIsDeleting(false);
  };
  return (
    <>
      <Button className="cursor-pointer">Update</Button>
      <Button
        onClick={() => handleDeleteHabit(id)}
        className="cursor-pointer w-20 text-center"
        variant={"destructive"}
      >
        {isDeleting ? <Spinner /> : "Delete"}
      </Button>
    </>
  );
}
