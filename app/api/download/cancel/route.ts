import { abortMap } from "@/app/lib/abort";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  console.log("<cancel>api/download/cancelにIDが届きました。：", id);
  if (!id) {
    console.log("<cancel>idがありません");
    return new Response("No id", { status: 400 });
  }
  const controller = abortMap.get(id);
  if (!controller) {
    console.log("<cancel>AbortControllerがありません");
    return new Response("No controller", { status: 400 });
  }
  console.log("<cancel>AbortControllerを取得しました。：", controller.signal);
  controller.abort();
  console.log("<cancel>AbortControllerをabortしました。：", id);
  abortMap.delete(id);
  console.log("<cancel>AbortMapからcontrollerを削除しました。：", id);
  return new Response("Canceled", { status: 200 });
}

