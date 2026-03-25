const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL = 80;

export class Spinner {
  private timer: ReturnType<typeof setInterval> | null = null;
  private frameIdx = 0;
  private text = "";
  private active = false;

  /** Only show spinner if stderr is a TTY (not when piped) */
  private get isTTY(): boolean {
    return !!process.stderr.isTTY;
  }

  start(text: string): void {
    this.text = text;
    this.active = true;
    if (!this.isTTY) return;

    this.frameIdx = 0;
    this.render();
    this.timer = setInterval(() => this.render(), INTERVAL);
  }

  update(text: string): void {
    this.text = text;
    if (!this.isTTY) return;
    this.render();
  }

  succeed(text: string): void {
    this.stop();
    if (!this.isTTY) return;
    process.stderr.write(`\r\x1b[K\x1b[32m✓\x1b[0m ${text}\n`);
  }

  fail(text: string): void {
    this.stop();
    if (!this.isTTY) return;
    process.stderr.write(`\r\x1b[K\x1b[31m✗\x1b[0m ${text}\n`);
  }

  stop(): void {
    this.active = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.isTTY) {
      process.stderr.write("\r\x1b[K");
    }
  }

  private render(): void {
    const frame = FRAMES[this.frameIdx % FRAMES.length];
    process.stderr.write(`\r\x1b[K\x1b[36m${frame}\x1b[0m ${this.text}`);
    this.frameIdx++;
  }
}
