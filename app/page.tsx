"use client";
import { useState, useRef, useEffect } from "react";

export default function Page() {
  const [progress, setProgress] = useState(0);
  const [id, setId] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isDownloading) {
      console.log("<useEffect>isDownloadingがfalseになりました。");
      setId(null);
      console.log("<useEffect>idをnullにしました。：", id);
      eventSourceRef.current?.close();
      console.log("<useEffect>eventSourceをクローズしました。：", eventSourceRef.current);
      eventSourceRef.current = null;
      console.log("<useEffect>eventSourceRefをnullにしました。：", eventSourceRef.current);
    }
  }, [isDownloading]);

  const handleDownload = () => {
    setIsDownloading(true);
    console.log("<handleDownload>isDownloadingをtrueにしました。");
    const id = crypto.randomUUID();
    setId(id);
    console.log("<handleDownload>idを設定しました。：", id);
    const eventSource = new EventSource(`/api/download?id=${id}`);
    eventSourceRef.current = eventSource;
    console.log("<handleDownload>RefにeventSourceを設定しました。：", eventSourceRef.current);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("<onmessage>event.dataを解析しました。：", data);
      setProgress(data.count);
    };
    eventSource.onerror = (event) => {
      console.log("<onerror>eventSource.onerrorが実行されました。");
      console.error(event);
      setIsDownloading(false);
    };
  };

  const handleCancel = async () => {
    const res = await fetch(`/api/download/cancel?id=${id}`);
    console.log("<handleCancel>fetchの結果：", res);
    if (res.ok) {
      console.log("<handleCancel>キャンセルが成功しました。");
      setIsDownloading(false);
    } else {
      console.log("<handleCancel>キャンセルが失敗しました。");
    }
  };


  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-8">
        <button onClick={handleDownload} className="bg-blue-500 text-white p-2 rounded-md">Download</button>
        <button onClick={handleCancel} className="bg-red-500 text-white p-2 rounded-md">Cancel</button>
      </div>
      <progress value={progress} max={100} className="w-full h-4 rounded-md" />

      <div>
        <p>progress: {progress}</p>
        <p>isDownloading: {isDownloading ? "true" : "false"}</p>
        <p>id: {id}</p>
        <p>eventSourceRef: {eventSourceRef.current ? "true" : "false"}</p>
      </div>
    </div>
  );
}
