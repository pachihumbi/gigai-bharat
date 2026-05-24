const DEMO_WORKSPACE_KEY = "gigai:demo-workspace";

export function enterDemoWorkspace() {
  sessionStorage.setItem(DEMO_WORKSPACE_KEY, "1");
}

export function exitDemoWorkspace() {
  sessionStorage.removeItem(DEMO_WORKSPACE_KEY);
}

export function isDemoWorkspace() {
  return sessionStorage.getItem(DEMO_WORKSPACE_KEY) === "1";
}
