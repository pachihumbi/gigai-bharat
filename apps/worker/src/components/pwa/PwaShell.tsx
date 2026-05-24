import { InstallFloatingButton } from "./InstallFloatingButton";
import { InstallPrompt } from "./InstallPrompt";
import { UpdatePrompt } from "./UpdatePrompt";
import { AppLaunchOverlay } from "./AppLaunchOverlay";

/** Lazy-loaded PWA chrome — keeps initial bundle smaller and isolates optional UI. */
export function PwaShell() {
  return (
    <>
      <UpdatePrompt />
      <InstallPrompt />
      <InstallFloatingButton />
      <AppLaunchOverlay />
    </>
  );
}
