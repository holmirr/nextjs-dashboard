export async function GET(request: Request) {
  const signal = request.signal;
  console.log("signalを取得しました。：", signal);
  try {

    for (let i = 0; i < 33; i++) {
      if (signal.aborted) {
        console.log("signalがabortされました。：", signal.aborted);
        return new Response("Abort", { status: 400 });
      }
      console.log("インクリメント。：", i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return new Response("OK");
  } catch (error) {
    if (signal.aborted) {
      console.log("signalがabortされました。：", signal.aborted);
      return new Response("Abort", { status: 400 });
    }
    console.log("エラーが発生しました。：", error);
    return new Response("Error", { status: 500 });
  }
}

