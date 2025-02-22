import { abortMap } from "@/app/lib/abort";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  console.log("api/downloadにIDが届きました。：", id);
  if (!id) {
    console.log("idがありません");
    return new Response("No id", { status: 400 });
  }
  const abortController = new AbortController();
  abortMap.set(id, abortController);
  console.log("abortControllerを設定しました。：", JSON.stringify(abortController.signal));

  let count = 0;


  const toSSE = (data: string) => {
    return `data: ${data}\n\n`;
  };

  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(() => {
        if (count < 21) {
          console.log("<in start>countを送信しています。：", count);
          controller.enqueue(toSSE(JSON.stringify({ count })));
          count++;
        } else {
          console.log("<in start>countが終了。：", count);
          clearInterval(interval);
          console.log("<in start>setIntervalをクリアしました。");
          controller.close();
          console.log("<in start>ReadableStreamのcontrollerをクローズしました。");
        }
      }, 1000);

      abortController.signal.addEventListener("abort", () => {
        console.log("<in abortListener>abortControllerのsignalがabortされました。");
        clearInterval(interval);
        console.log("<in abortListener>setIntervalをクリアしました。");
      });

      return () => {
        console.log("<in startReturn>ReadableStreamのstart()コールバックのreturn文が実行されました。");
        clearInterval(interval);
        console.log("<in startReturn>setIntervalをクリアしました。");
      }
    },
    // async cancel() {
    //   console.log("<in cancel>ReadableStreamのcancel()メソッドが実行されました。");
    //   const controller = abortMap.get(id);
    //   if (controller) {
    //     console.log("<in cancel>abortMapからcontrollerを取得しました。：", JSON.stringify(controller.signal));
    //     console.log("<in cancel>3秒待ってからabortします。");
    //     await new Promise((resolve) => setTimeout(resolve,3000));
    //     controller.abort();
    //     console.log("<in cancel>abortしました。");
    //   }
    // },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
