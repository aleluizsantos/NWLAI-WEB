import { VideoInputForm } from "./video-input-form";
import { OptionsInputForm } from "./options-input-form";

export function Aside() {
  return (
    <aside className="w-80 space-y-4">
      <VideoInputForm />
      <OptionsInputForm />
    </aside>
  );
}
