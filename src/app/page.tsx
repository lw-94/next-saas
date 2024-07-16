'use client'

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/server/db/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "~/auth";
import { trpcClient } from "../utils/trpcClient";

export default function Home() {
  // 'use server'
  // const users = await db.query.Users.findMany()
  // const users = await db.select().from(Users).where(eq(Users.id, 1))
  // const session = await auth()

  // if (!session?.user) {
  //   redirect("/api/auth/signin")
  // }

  useEffect(() => {
    trpcClient.hello.query().then(console.log)
  }, [])

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-center text-3xl font-bold">Create App</h1>
        <Input placeholder="Enter app name" />
        <Textarea placeholder="Enter app description" />
        <Button>Click Me</Button>
      </form>
    </div>
  )
}
