interface Command {
  execute(): Promise<boolean>;
}
export { Command };
