import { NextRequest } from "next/server";

export function GET(request: NextRequest, { params: { id } }: { params: { id: string[] } }) {
  return Response.json({
    id: id
  })
}