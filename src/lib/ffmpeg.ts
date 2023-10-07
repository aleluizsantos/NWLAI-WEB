/**
 * ffmpeg.wasm é uma porta WebAssembly / JavaScript pura do FFmpeg,
 * permitindo gravação, conversão e transmissão de vídeo e áudio
 * diretamente nos navegadores. Aproveitamos o Emscripten para transpilar
 * o código-fonte do FFmpeg e muitas bibliotecas para o WebAssembly e
 * desenvolver uma biblioteca mínima, mas essencial, para liberar os
 * desenvolvedores de requisitos comuns, como executar o ffmpeg dentro do
 * web trabalhador e muito mais.
 * https://ffmpegwasm.netlify.app/docs/getting-started/usage
 */
import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { toBlobURL } from "@ffmpeg/util";

import coreURL from "../ffmpeg/fmpeg-core.js?url";
import wasmURL from "../ffmpeg/ffmpeg-core.wasm?url";

let ffmpeg: FFmpeg | null;

export async function getFFmpeg() {
  // const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm";

  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded)
    await ffmpeg.load({
      coreURL,
      wasmURL,
      // coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      // wasmURL: await toBlobURL(
      //   `${baseURL}/ffmpeg-core.wasm`,
      //   "application/wasm"
      // ),
      //   workerURL: await toBlobURL(
      //     `${baseURL}/ffmpeg-core.worker.js`,
      //     "text/javascript"
      //   ),
    });

  return ffmpeg;
}
