type ReturnType = "Good Morning" | "Good Afternoon" | "Good Evening";

export function getTimeOfDay(): ReturnType {
  const getHours = new Date().getHours();
  if (getHours >= 0 && getHours < 12) {
    return "Good Morning";
  } else if (getHours >= 12 && getHours < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}
