export class UniversalPlayer {
  private ytPlayer: any;
  private listener: any;
  constructor(
    public video: string | number,
    public el: HTMLElement,
  ) {}

  private async setupPlayer() {
    const YouTubePlayer = (await import("youtube-player")).default;
    this.ytPlayer = YouTubePlayer(this.el);
    this.ytPlayer.cueVideoById(this.video as string);
  }

  // Static constructor to await dynamic imports
  static async create(video: string | number, el: HTMLElement) {
    const obj = new UniversalPlayer(video, el);
    await obj.setupPlayer();
    return obj;
  }

  play() {
    this.ytPlayer.playVideo();
  }

  destroy() {
    this.ytPlayer.off(this.listener);
    this.ytPlayer.destroy();
  }

  onEnded(cb: () => void) {
    this.listener = this.ytPlayer.on(
      "stateChange",
      (event: { data: number }) => {
        if (event.data === 0) cb();
      },
    );
  }
}
