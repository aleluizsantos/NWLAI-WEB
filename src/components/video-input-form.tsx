import { ChangeEvent, FormEvent, useMemo, useState, useRef } from "react";
import { FileVideo, Upload, CheckCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Progress } from "./ui/progress";

type Status =
  | "wainting"
  | "converting"
  | "uploading"
  | "generating"
  | "success";

const statusMessage = {
  wainting: (
    <>
      Carregando Vídeo <Upload className="h-4 w-4 ml-2" />
    </>
  ),
  converting: "Convertendo...",
  uploading: "Carregando...",
  generating: "Transcrevendo...",
  success: (
    <>
      Sucesso
      <CheckCircle className="h-4 w-4 ml-2" />
    </>
  ),
};

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("wainting");
  const [progressValue, setProgressValue] = useState<number | null | undefined>(
    0
  );
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = promptInputRef.current?.value;

    if (!videoFile) return;

    setStatus("uploading");

    // Converter o video em audio
    const audioFile = await convertVideoToAudio(videoFile);

    return;
  }

  async function convertVideoToAudio(video: File) {
    console.log("Convert initial...");

    const ffmpeg = await getFFmpeg();
    // ffmpeg.on("log", (log) => console.log(log));

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    ffmpeg.on("progress", (progress) => {
      const valueProgess = Math.round(progress.progress * 100);
      setProgressValue(valueProgess);
      console.log("Converter progress: " + valueProgess);
    });

    setStatus("converting");

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");
    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    setStatus("success");

    return audioFile;
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;
    setProgressValue(0);
    setStatus("wainting");
    if (!files) return;
    const selectedFile = files[0];
    setVideoFile(selectedFile);
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null;
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <>
      <form onSubmit={handleUploadVideo} className="space-y-4">
        <label
          htmlFor="video"
          className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
        >
          {previewURL ? (
            <video
              src={previewURL}
              controls={false}
              className="pointer-events-none absolute inset-0 aspect-video"
            />
          ) : (
            <>
              <FileVideo className="w-4 h-4" />
              Selecione um vídeo
            </>
          )}
        </label>
        <input
          className="sr-only"
          type="file"
          id="video"
          accept="video/mp4"
          onChange={handleFileSelected}
        />

        <Progress value={progressValue} className="w-full" />

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
          <Textarea
            ref={promptInputRef}
            id="transcription_prompt"
            className="h-20 leading-relaxed resize-none"
            placeholder="Inclua palavras chaves mencioonadas no vídeo separadas por vírgula (,)"
          />
        </div>

        <Button
          data-success={status === "success"}
          disabled={status !== "wainting"}
          type="submit"
          className="w-full data-[success=true]:bg-emerald-400"
        >
          {statusMessage[status]}
        </Button>
      </form>
      <Separator />
    </>
  );
}
