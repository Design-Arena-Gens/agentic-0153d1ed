import { NextResponse } from "next/server";
import { runSelfCallingAgent } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({ goal: "" }));
    const goal = typeof payload.goal === "string" ? payload.goal : "";
    const result = await runSelfCallingAgent(goal);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Agent execution failed:", error);
    return NextResponse.json(
      {
        transcript: [],
        outcome: "Agent crashed during execution.",
        completed: false
      },
      { status: 500 }
    );
  }
}
