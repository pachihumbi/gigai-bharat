const DEMO_WORKSPACE_KEY = "gigai:demo-workspace";

function canUseSessionStorage() {
  return typeof sessionStorage !== "undefined";
}

export function enterDemoWorkspace() {
  if (!canUseSessionStorage()) return;
  try {
    sessionStorage.setItem(DEMO_WORKSPACE_KEY, "1");
  } catch {
    /* storage blocked */
  }
}

export function exitDemoWorkspace() {
  if (!canUseSessionStorage()) return;
  try {
    sessionStorage.removeItem(DEMO_WORKSPACE_KEY);
  } catch {
    /* ignore */
  }
}

export function isDemoWorkspace() {
  if (!canUseSessionStorage()) return false;
  try {
    return sessionStorage.getItem(DEMO_WORKSPACE_KEY) === "1";
  } catch {
    return false;
  }
}
