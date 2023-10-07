import { Textarea } from "./ui/textarea";

export function Section() {
  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="grid grid-rows-2 gap-4 flex-1">
        <Textarea
          className="resize-none p-4 leading-relaxed"
          placeholder="Inclua o prompt para a IA"
        />
        <Textarea
          readOnly
          className="resize-none p-4 leading-relaxed"
          placeholder="Resultado geradoo pela IA"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Lembre-se você pode utilizar a variável{" "}
        <code className="text-violet-400">{"{transcription}"}</code> no seu
        promptp para adicionar o conteúdoo da transciçãoo do vídeo selecionaddo.{" "}
      </p>
    </section>
  );
}
