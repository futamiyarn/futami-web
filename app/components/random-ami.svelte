<svelte:options
  customElement={{
    tag: "ami-futami",
    shadow: "none",
  }}
/>

<script lang="ts">
  import { onMount } from "svelte";
  import data from "../data/random-ami.json";
  import YoutubePlayer from "youtube-player";
  import type { YouTubePlayer } from "youtube-player/dist/types";
  import MuteIcon from "../icons/volume-xmark.svelte";
  import PlayIcon from "../icons/circle-play.svelte";

  interface Content {
    title: string;
    videoID: string;
    original?: string;
  }

  let lastPlayed: Content[] = [];
  let played: Content = { title: "", videoID: "", original: undefined };
  let player: YouTubePlayer;
  let isPause: Boolean = false;
  let isStarting: Boolean = true;
  let isMuted: boolean = true;

  onMount(async () => {
    await changeSong();

    player.on("ready", async () => {
      if (isStarting) player.mute();
      await player.playVideo();

      isStarting = false;
    });

    player.on("stateChange", async (event) => {
      if (event.data === 0) await changeSong();
    });
  });

  async function changeSong() {
    if (data.length === lastPlayed.length) lastPlayed = [];

    const currData = data.filter(
      (d) => !lastPlayed.map((p) => p.videoID).includes(d.videoID),
    );

    played = currData[Math.floor(Math.random() * currData.length)];
    lastPlayed.push(played);

    if (player) {
      player.loadVideoById(played.videoID);

      return;
    }

    player = await YoutubePlayer("not-found-player", {
      videoId: played.videoID,
      playerVars: {
        autoplay: 1,
        disablekb: 1,
        loop: 1,
        controls: 0,
        fs: 0,
        origin: window.location.href,
      },
    });
  }

  async function clickPlayer() {
    const playState = await player.getPlayerState();

    if (isMuted) {
      await player.unMute();
      isMuted = false;
    } else if (playState === 1) {
      isPause = true;
      await new Promise((r) => setTimeout(r, 250));

      await player.pauseVideo();
    } else if (playState === 2) {
      await player.playVideo();
      await new Promise((r) => setTimeout(r, 350));
      isPause = false;
    }
  }
</script>

<div>
  <h3 class="my-3 text-center text-sm md:text-lg">
    Ami Futami - <a
      href="https://project-imas.wiki/{played.title.replace(' ', '_')}"
      target="_blank"
      rel="noopener noreferrer">{played.title}</a
    >
    {#if played.original}
      (Original by <a
        href="https://project-imas.wiki/{played.original.replace(' ', '_')}"
        target="_blank"
        rel="noopener noreferrer">{played.original}</a
      >){/if}
  </h3>

  <div
    class="mx-auto relative w-full aspect-video h-auto sm:w-[85%] md:w-[70%] lg:w-[50%] rounded-lg overflow-hidden shadow-md"
  >
    <div id="not-found-player" class="player bg-black"></div>

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="player absolute top-0 left-0 z-[2] justify-center items-center"
      on:click={clickPlayer}
    >
      <img
        src="https://img.youtube.com/vi_webp/{played.videoID}/mqdefault.webp"
        alt="Thumbnail"
        class="player transition-opacity duration-500 ease-out"
        style={!isPause ? "opacity:0" : ""}
      />
      <div
        class="player absolute top-0 left-0 backdrop-blur-md transition-opacity duration-500 ease-out"
        style={!isPause ? "opacity:0" : ""}
      ></div>
      <span
        class="player absolute top-0 left-0 justify-center items-center p-4 text-5xl drop-shadow-md text-white font-bold transition-opacity duration-500 ease-in-out"
        style={!isPause ? "opacity:0" : ""}><PlayIcon /></span
      >
      <span
        class="player absolute top-0 left-0 justify-start items-end p-4 text-3xl drop-shadow-md text-white font-bold transition-opacity duration-500 ease-in-out"
        style={!isMuted || isStarting ? "opacity:0" : ""}><MuteIcon /></span
      >
    </div>
  </div>
  <span class="text-center w-screen inline-block text-sm py-3 mb-12"
    >Source: <a
      href="https://youtu.be/{played.videoID}"
      target="_blank"
      rel="noopener noreferrer">YouTube</a
    ></span
  >
</div>

<style lang="scss" scoped>
  a {
    @apply text-slate-500 transition-colors duration-300 ease-out hover:text-yellow-500;
  }

  .player {
    @apply flex h-full w-full;
  }
</style>
