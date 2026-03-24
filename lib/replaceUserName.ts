export function replaceUserName(text: string, userName: string): string {
  return text.replace(/\{User_Name\}/g, userName || "PM");
}
